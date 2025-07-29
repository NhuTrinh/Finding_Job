import mongoose from "mongoose";
import Gender from "../shared/constants/gender.enum.js";

// 1. Education Schema
const educationSchema = new mongoose.Schema({
    schoolName: {type: String, required: true},
    degree: { type: String},
    major: {type: String},
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
},{_id: false});

// 2. Work Experience Schema
const workExperienceSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    jobTitle: { type: String, required: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String },
    project: { type: String },
}, { _id: false });

// 3. Skill Schema
const skillSchema = new mongoose.Schema({
    coreSkills: [{ type: String }],
    softSkills: [{ type: String }]
}, { _id: false });

// 4. Foreign Languages Schema
const languageSchema = new mongoose.Schema({
    language: { type: String, required: true },
    level: { type: String, required: true }  
}, { _id: false });

// 5. Highlight Projects Schema
const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    description: { type: String },
    projectUrl: { type: String },
}, { _id: false });

// 6. Certificates Schema
const certificateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    issueDate: { type: Date, required: true },
    certificateUrl: { type: String },
    description: { type: String },
}, { _id: false });

// 7. Awards Schema
const awardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    organization: { type: String, required: true },
    issueDate: { type: Date, required: true },
    description: { type: String },
}, { _id: false });

// 7. Attachment Schema
const attachmentSchema = new mongoose.Schema({
    fileUrl: { type: String},
    preferredWorkLocation: [{ type: String}],
    totalYearsOfExperience: { type: Number},
    currentJobLevel: { type: String},
    expectedWorkingModel: { type: String},
    expectedSalary: {                   
        salaryMin: { type: Number },
        salaryMax: { type: Number }
    },
    currentSalary: { type: Number},
    coverLetter: { type: String},
    uploadedAt: { type: Date, default: Date.now },
}, { _id: false });

// 8. My Jobs (Applied, Saved)
    const myJobSchema = new mongoose.Schema({
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
        createdAt: { type: Date, default: Date.now }
    }, { _id: false });

const candidateSchema = new mongoose.Schema({
    accountId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'accounts',
        required: true
    },
    profile: {
        avatar: { type: String, default: "" },
        jobTitle: { type: String, default: ""},
        phoneNumber: { type: String, default: "" },
        birthDay: { type: Date, default: "" },
        gender: {
            type: String,
            enum: Object.values(Gender),
            require: false,
        },
        address: {
        line:    { type: String },
        city:    { type: String },
        country: { type: String }
        },
        link: { type: String, default: "" },
        aboutMe: { type: String, default: "" }, 
        education: [{type: educationSchema}], //1.
        workExperience: [{type: workExperienceSchema}], //2.
        skills: [{type: skillSchema}], //3.
        foreignLanguages: [{type: languageSchema}], //4.
        highlightProjects: [{type: projectSchema}], //5.
        certificates: [{type: certificateSchema}], //6.
        awards: [{type: awardSchema}],//7.
    },
    attachments: { type: attachmentSchema, default: {}},
    myJobs: {
        saved: [{type: myJobSchema}],
        applied: [{type: myJobSchema}],
        viewed: [{type: myJobSchema}],
        default: {}
    },

},{timestamps: true},);

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;