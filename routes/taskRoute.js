const express = require('express');
const { TaskModel } = require('../model/taskModel');
const taskRoute = express.Router();


taskRoute.get("/", async (req, res) => {
    try {
        const userId = req.userId;
        const tasks = await TaskModel.find({ userId });
        return res.status(200).json({ tasks })
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

taskRoute.post("/", async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId;

        if (!title || !description) {
            return res.status(400).json({ msg: 'Title and description are required fields.' });
        }

        const newTask = new TaskModel({ ...req.body, userId });

        await newTask.save();

        return res.status(200).json({ msg: 'Task created successfully', task: { ...req.body, userId } });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

taskRoute.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const task = await TaskModel.findOne({ _id: id });

        if (userId !== task.userId.toString()) {
            return res.status(400).json({ msg: "You are not authorized" });
        } else {
            await TaskModel.findByIdAndUpdate({ _id: id }, req.body);
            return res.status(200).json({ msg: "The task has been updated successfully" });
        }
    } catch (err) {
    return res.status(400).json({ error: err.message });
}
});

taskRoute.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const task = await TaskModel.findOne({ _id: id });

        if (userId !== task.userId.toString()) {
            return res.status(400).json({ msg: "You are not authorized" });
        } else {
            await TaskModel.findByIdAndDelete({ _id: id });
            return res.status(200).json({ msg: "The task has been deleted successfully"});
        }
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});


module.exports = { taskRoute };