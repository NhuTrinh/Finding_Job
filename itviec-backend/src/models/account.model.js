
import mongoose from "mongoose";
import Role from "../shared/constants/role.enum.js";

const accountSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
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
    role: {
        type: String,
        enum: Object.values(Role),
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Account = mongoose.model('accounts', accountSchema);

export default Account;