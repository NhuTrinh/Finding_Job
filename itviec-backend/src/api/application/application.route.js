import express from "express";
import ApplicationController from "./application.controller.js";
import authenticate from "../../shared/middlewares/authenticate.middleware.js";
import authorizeRole from "../../shared/middlewares/authorizeRole.middleware.js";

const router = express.Router();

/* 1. ====== CANDIDATE ====== */
router.post('/jobs/:jobId/applications', authenticate, authorizeRole('candidate'), ApplicationController.apiApplyJob);
router.get('/applications', authenticate, authorizeRole('candidate'), ApplicationController.apiCandidateGetApplication);
router.delete('/applications/:id', authenticate, authorizeRole('candidate'), ApplicationController.apiCandidateCancelApplication);

/* 2. ====== RECRUITER ====== */
router.get('/applications/recruiter', authenticate, authorizeRole('recruiter'), ApplicationController.apiRecruiterGetApplication);
router.patch('/applications/:id/accept', authenticate, authorizeRole('recruiter'), ApplicationController.apiRecruiterAcceptApplication);
router.patch('/applications/:id/reject', authenticate, authorizeRole('recruiter'), ApplicationController.apiRecruiterRejectApplication);
export default router;