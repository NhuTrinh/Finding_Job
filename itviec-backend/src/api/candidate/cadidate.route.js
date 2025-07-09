import express from 'express';
import authenticate from '../../shared/middlewares/authenticate.middleware.js';
import authorizeRole from '../../shared/middlewares/authorizeRole.middleware.js';
import CandidateController from './candidate.controller.js';
import ApplicationController from '../application/application.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/ung-vien/ho-so-cv:
 *   get:
 *     summary: Xem hồ sơ tổng quan của ứng viên
 *     tags:
 *       - Ứng viên
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Chưa xác thực
 */

//Các endpoint 
router.route('/profile-cv')
    .get(authenticate, authorizeRole('candidate'), CandidateController.apiGetProfile)
    .put(authenticate, authorizeRole('candidate'), CandidateController.apiUpdateProfile);

router.route('/profile-cv/manage-cv')
    .get(authenticate, authorizeRole('candidate'), CandidateController.apiGetAttachments)
    .put(authenticate, authorizeRole('candidate'), CandidateController.apiUpdateAttachments);

export default router;