
import express from "express";
import authenticate from "../../shared/middlewares/authenticate.middleware.js";
import authorizeRole from "../../shared/middlewares/authorizeRole.middleware.js";
import JobController from "./job.controller.js";
import ApplicationController from "../application/application.controller.js";

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Chức năng đăng công việc
 *     tags:
 *       - Công việc
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               matKhau:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.route('/')
    .get(JobController.apiGetJobs)
    .post(authenticate, authorizeRole('recruiter'), JobController.apiAddJob);

router.route('/recruiter')
    .get(authenticate, authorizeRole('recruiter'), JobController.apiGetJobByRecruiterId);

router.route('/:id')
    .get(JobController.apiGetJobById)
    .put(authenticate, authorizeRole('recruiter'), JobController.apiUpdateJob)
    .delete(authenticate, authorizeRole('recruiter'), JobController.apiDeleteJob);

export default router;