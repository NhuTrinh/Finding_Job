
import RecruiterService from "../../services/recruiter.service.js";
import { apiSuccess } from "../../shared/helpers/apiResponse.helper.js";

export default class RecruiterController{
    // 1. Tính năng nhà tuyển dụng xem profile của mình
    static async apiGetProfile(req, res, next){
        try {
            const accountId = req.account?.accountId;
            if (!accountId) throw new InvalidCredentialsError("Bạn cần đăng nhập");

            const respose = await RecruiterService.getProfile(accountId);
            apiSuccess(res, respose, 200);
        } catch (error) {
            next(error);
        }
    }

    // 2. Tính năng nhà tuyển dụng thay đổi thông tin của mình
    static async apiUpdateProfile(req, res, next) {
        try {
            const accountId = req.account?.accountId;
            if (!accountId) throw new InvalidCredentialsError("Bạn cần đăng nhập");

            const newProfile = req.body;

            const respose = await RecruiterService.updateProfile(accountId, newProfile);
            apiSuccess(res, respose, 200);
        } catch (error) {
            next(error);
        }
    }
}