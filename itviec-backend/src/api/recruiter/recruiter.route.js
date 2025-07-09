
import express from "express";
import RecruiterController from "./recruiter.controller.js";
import authenticate from "../../shared/middlewares/authenticate.middleware.js";
import authorizeRole from "../../shared/middlewares/authorizeRole.middleware.js";

const router = express.Router();

router.route('/profile')
    .get(authenticate, authorizeRole('recruiter'), RecruiterController.apiGetProfile)
    .put(authenticate, authorizeRole('recruiter'), RecruiterController.apiUpdateProfile);

export default router;