
import mongoose from "mongoose";


// 1. Tạo collection
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    jobTitle: { type: String, required: true},
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    companyId:   { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    salaryMin: Number,
    salaryMax: Number,
    address: {
        line:    { type: String },
        city:    { type: String },
        country: { type: String }
    },
    employmentType: { type: String, enum: ["Full-time","Part-time","Contract","Internship","Remote"], default: "Full-time" },
    createdAt: { type: Date, default: Date.now },
    skills:            [{ type: String }],   
    jobExpertise:      [{ type: String }],   
    jobDomain:         [{ type: String }],
    description: {type: String},
},{timestamps: true});

// Đánh index
jobSchema.index({
    jobTitle: 'text',
    skills: 'text',
})

jobSchema.index({ 'address.city': 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;