const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/userModel");
const { BlockModel } = require("../model/blacklistModel");
const { UserProfileModel } = require("../model/userProfileModel");
const { authMiddleware } = require("../middleware/authMiddleware");
const userRoute = express.Router();
require("dotenv").config();


userRoute.post("/register", async (req, res) => {

    const { email, password } = req.body;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (!uppercaseRegex.test(password) || !numberRegex.test(password) || !specialCharRegex.test(password) || password.length < 6) {
        return res.status(400).send({ msg: 'Password should contain at least one uppercase letter, one numeric digit, and one special character, and password length should be at least 6!' });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (user) {
            return res.status(200).json({ msg: "User already exist, please login" })
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            } else {
                const newUser = new UserModel({ ...req.body, password: hash });
                await newUser.save();

                const userProfile = new UserProfileModel({ ...req.body, userId: newUser._id });
                await userProfile.save();

                return res.status(200).json({ msg: "user registered", user: req.body })
            }
        })
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
})


userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    const token = jwt.sign({ userId: user._id, userName: user.name }, process.env.SecretKey, { expiresIn: "7h" });
                    return res.status(200).json({ msg: "login successful", token });
                } else {
                    return res.status(400).json({ msg: "wrong credentials" });
                }
            })
        } else {
            return res.status(400).json({ msg: "user not exist" });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
})


userRoute.get("/logout", authMiddleware, async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        const user = new BlockModel({ token })
        await user.save();
        return res.status(200).json({ msg: "user has been successfully logged out" });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});


userRoute.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const userProfile = await UserProfileModel.find({ userId });
        if (!userProfile) {
            return res.status(400).json({ msg: "user's profile not found" });
        } else {
            return res.status(200).json({ userProfile });
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
})


userRoute.patch("/profile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const { email, name } = req.body;
        const userProfile = await UserProfileModel.findOne({ _id: id });
        const user = await UserModel.findOne({ _id: userId })

        if (userId !== userProfile.userId.toString()) {
            return res.status(400).json({ msg: "you are not authorized" });
        }
        if (email !== user.email || name !== user.name) {
            await UserModel.findByIdAndUpdate({ _id: userId }, { email, name });
        }

        await UserProfileModel.findByIdAndUpdate({ _id: id }, req.body);
        
        return res.status(200).json({ msg: "The user's profile has been updated successfully" });

    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
})

module.exports = { userRoute };