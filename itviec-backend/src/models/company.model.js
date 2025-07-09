
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    logo: { type: String },
    type: { type: String },
    industry: { type: String},
    size: { type: String},
    address: {
    line:    { type: String },
    city:    { type: String },
    country: { type: String }
    },
    workingDays: { type: String},
    Overtime: { type: String},
    overview: { type: String},
    keySkills: [{ type: String }],
    perksContent: { type: String},
    fanpageUrl: {type: String},
    websiteUrl: {type: String},
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recruiter",
        required: true
    }
}, { timestamps: true});

const Company = mongoose.model('Company', companySchema);

export default Company;