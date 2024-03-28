const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    profileUrl: { type: String },
    name: { type: String },
    phoneNumber: { type: String },
    gender: { type: String, },
    address: { type: String },
}, {
    versionKey: false
});

const UserProfileModel = mongoose.model('UserProfile', userProfileSchema);
module.exports = { UserProfileModel }
