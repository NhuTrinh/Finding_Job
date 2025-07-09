
import express from "express";
import AccountController from "./auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /accounts/candidate/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     tags:
 *       - Tài khoản
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

/* 1. ===== REGISTER ===== */
router.post('/candidate/register', AccountController.apiRegisterCandidate);
router.post('/recruiter/register', AccountController.apiRegisterRecruiter);

/* 2. ===== LOGIN ===== */
router.post('/candidate/login', AccountController.apiCandidateLogin);
router.post('/recruiter/login', AccountController.apiRecruiterLogin);

export default router;