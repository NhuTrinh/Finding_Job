
import AccountService from "../../services/account.service.js";
import { apiSuccess } from "../../shared/helpers/apiResponse.helper.js";

class AccountController {
    // 1. Tính năng ứng viên đăng ký
    static async apiRegisterCandidate(req, res, next) {
        try {
            const result = await AccountService.registerCandidate(req.body);
            return apiSuccess(res, result, 201);
        } catch (error) {
            next(error);
        }
    }

    // 2. Tính năng nhà tuyển dụng đăng ký
    static async apiRegisterRecruiter(req, res, next) {
        try {
            const result = await AccountService.registerRecruiter(req.body);
            return apiSuccess(res, result, 201)
        } catch (error) {
            next(error);
        }
    }

    // 3. Tính năng ứng viên đăng nhập
    static async apiCandidateLogin(req, res, next) {
        try {
            const { email, password } = req.body;        
            const result = await AccountService.candidateLogin(email, password);
            res.status(200).json({status: 'success', token: result});
        } catch (error) {
            next(error);
        }
    }

    // 4. Tính năng nhà tuyển dụng đăng nhập
    static async apiRecruiterLogin(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AccountService.recruiterLogin(email, password);
            res.status(200).json({ status: 'success', token: result });
        } catch (error) {
            next(error);
        }
    }
}

export default AccountController;