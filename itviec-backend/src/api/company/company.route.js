
import express from "express";
import CompanyController from "./company.controller.js";
import authenticate from "../../shared/middlewares/authenticate.middleware.js";
import authorizeRole from "../../shared/middlewares/authorizeRole.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Chức năng đăng công việc
 *     tags:
 *       - Công ty
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
    .get(CompanyController.apiGetCompanies)
    .post(authenticate, authorizeRole('recruiter'), CompanyController.apiCreateCompany);

router.route('/:id')
    .get(CompanyController.apiGetCompanyById)
    .put(authenticate, authorizeRole('recruiter'), CompanyController.apiUpdateCompany)
    .delete(authenticate, authorizeRole('recruiter'), CompanyController.apiDeleteCompany)
export default router;