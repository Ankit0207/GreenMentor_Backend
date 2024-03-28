const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: "false"
    }
}, {
    versionKey: false,
    timestamps: true,
});

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = { TaskModel };