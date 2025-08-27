import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isUserAdmin: {
        type: Boolean,
        default: false,
    },
    fullName: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "PreferNotToSay"], 
        default: "PreferNotToSay"
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;