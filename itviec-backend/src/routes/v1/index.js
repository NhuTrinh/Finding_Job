
import express from "express";
import AuthRouter from '../../api/auth/auth.route.js'
import CandidateRouter from '../../api/candidate/cadidate.route.js';
import CompanyRouter from "../../api/company/company.route.js";
import JobRouter from "../../api/job/job.route.js";
import ApplicationRouter from "../../api/application/application.route.js";
import RecruiterRouter from "../../api/recruiter/recruiter.route.js";


const router = express.Router();

router.use('/accounts', AuthRouter);
router.use('/candidates', CandidateRouter);
router.use('/recruiters', RecruiterRouter);
router.use('/companies', CompanyRouter);
router.use('/jobs', JobRouter);
router.use(ApplicationRouter);

export default router;