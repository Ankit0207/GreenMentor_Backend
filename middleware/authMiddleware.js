const jwt = require("jsonwebtoken");
const { BlockModel } = require("../model/blacklistModel");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (token) {
            const tokenExist = await BlockModel.find({ token })
            if (tokenExist.length) {
                return res.status(400).json({ error: "please login again" })
            }
            const decoded = jwt.verify(token, process.env.SecretKey);
            if (decoded) {
                req.userId = decoded.userId;
                req.userName = decoded.userName;
                next();
            } else {
                res.status(400).json({ msg: "user is not authorized" });
            }
        } else {
            res.status(400).json({ msg: "login to continue" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = { authMiddleware };