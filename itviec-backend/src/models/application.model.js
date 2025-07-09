
import mongoose from "mongoose";
import Status from "../shared/constants/statusApplication.enum.js"

const applicationSchema = new mongoose.Schema({
    candidateId:  { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Candidate', 
        required: true,
        },
    jobId:  { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true,
        },
    status: {
        type: String,
        enum: Object.values(Status),
        required: true,
    },
},{timestamps: true});

const Application = mongoose.model('applications', applicationSchema);
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export default Application;