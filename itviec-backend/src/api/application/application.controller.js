
import ApplicationService from "../../services/application.service.js";
import InvalidCredentialsError from "../../shared/exceptions/InvalidCredentialsError.exception.js";
import { apiSuccess } from "../../shared/helpers/apiResponse.helper.js";

export default class ApplicationController {

    // 1. Tính năng ứng viên nộp đơn ứng tuyển
    static async apiApplyJob(req, res, next) {
        try {
            const candidateId = req.account?.accountId;
            const { jobId } = req.params;
            const result = await ApplicationService.applyJob(jobId, candidateId);

            return apiSuccess(res, result, 201);
        } catch (error) {
            next(error);
        }
    }

    // 2. Tính năng ứng viên xem danh sách đơn ứng tuyển của mình
    static async apiCandidateGetApplication(req, res, next) {
        try {
            const candidateId = req.account?.accountId;
            const result = await ApplicationService.candidateGetApplications(candidateId);

            return apiSuccess(res, result, 200);
        } catch (error) {
            next(error);
        }
    }

    // 3. Tính năng ứng viên hủy đơn ứng tuyển của mình
    static async apiCandidateCancelApplication(req, res, next) {
        try {
            const candidateId = req.account?.accountId;
            const { id } = req.params;
            await ApplicationService.candidateCancelApplication(id, candidateId);

            res.status(200).json({ status: "success" });
        } catch (error) {
            next(error);
        }
    }

    // 4. Tính năng nhà tuyển dụng xem danh sách đơn ứng tuyển vào công việc của mình
    static async apiRecruiterGetApplication(req, res, next) {
        try {

            const recruiterId = req.account?.accountId;
            if (!recruiterId) throw new InvalidCredentialsError("Bạn cần đăng nhập để thao tác");

            const result = await ApplicationService.recruiterGetApplications(recruiterId);
            return apiSuccess(res, result, 200);
        } catch (error) {
            next(error);
        }
    }


    // 5. Tính năng nhà tuyển dụng chấp nhận đơn ứng tuyển
    static async apiRecruiterAcceptApplication(req, res, next) {
        try {
            const recruiterId = req.account?.accountId;
            if (!recruiterId) throw InvalidCredentialsError("Bạn cần đăng nhập để thao tác");

            const { id } = req.params;
            await ApplicationService.recruiterAcceptApplication(id, recruiterId);
            res.status(200).json({ status: 'success', message: 'Đã chấp nhận đơn ứng tuyển thành công' });
        } catch (error) {
            next(error);
        }
    }

    // 6. Tính năng nhà tuyển dụng từ chối đơn ứng tuyển
    static async apiRecruiterRejectApplication(req, res, next) {
        try {
            const recruiterId = req.account?.accountId;
            if (!recruiterId) throw InvalidCredentialsError("Bạn cần đăng nhập để thao tác");

            const { id } = req.params;
            await ApplicationService.recruiterRejectApplication(id, recruiterId);
            res.status(200).json({ status: 'success', message: 'Đã từ chối đơn ứng tuyển thành công' });
        } catch (error) {
            next(error);
        }
    }
}