
import mongoose from "mongoose";
import Gender from "../shared/constants/gender.enum.js";

const recruiterSchema = new mongoose.Schema({
    accountId:      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account', 
        required: true,
        unique: true },
    phoneNumber: { 
        type: String,
        require: true },
    gender: {
        type: String,
        enum: Object.values(Gender),
        required: false,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    recruiterTitle: { type: String },
    linkedIn: { type: String},
},{timestamps: true});

const Recruiter = mongoose.model('recruiters', recruiterSchema);

export default Recruiter;