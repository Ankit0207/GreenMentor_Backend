const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    name:{
        type: String,
        required: true,
        trim: true,  
    },
   
    password: {
        type: String,
        required: true,
        trim: true
    }, 
}, {
    versionKey: false
  });



const UserModel = mongoose.model("User", userSchema);

module.exports = {
    UserModel
};
