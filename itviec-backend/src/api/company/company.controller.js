
import CompanyDao from "../../dao/company.dao.js";
import CompanyService from "../../services/company.service.js";
import { apiSuccess } from "../../shared/helpers/apiResponse.helper.js";
import ForbiddenError from "../../shared/exceptions/ForbiddenError.js";
import BadResquestError from "../../shared/exceptions/BadrequestError.js";

class CompanyController {

    // 1. Tính năng tạo công ty
    static async apiCreateCompany(req, res, next) {
        try {
            const recruiterId = req.account.accountId;
            const companyData = {
                ...req.body,
                createBy: recruiterId
            }

            const result = await CompanyService.createCompany(companyData);
            return apiSuccess(res, result, 201);
        } catch (error) {
            next(error);
        }
    }

    // 2. Tính năng xem danh sách công ty
    static async apiGetCompanies(req, res, next) {
        try {
            const response = await CompanyService.getCompanies();
            return apiSuccess(res, response, 200);
        } catch (error) {
            next(error);
        }
    }

    // 3. Tính năng xem chi tiết công ty
    static async apiGetCompanyById(req, res, next) {
        try {

            const { id } =  req.params;
            const response = await CompanyService.getCompanyById(id);
            return apiSuccess(res, response, 200);
        } catch (error) {
            next(error);
        }
    }

    static async apiUpdateCompany(req, res, next) {
        try {
            const recruiterId = req.account?.accountId;
            if (!recruiterId) throw BadResquestError("Bạn chưa đăng nhập")

            const { id } = req.params;
            if (!id) throw new BadResquestError("Thiếu id của công việc");

            const companyData = req.body;

            const response = await CompanyService.updateCompany(id, companyData, recruiterId);
            return apiSuccess(res, response, 200);
        } catch (error) {
            next(error);
        }
    }

    static async apiDeleteCompany(req, res, next) {
        try {
            const recruiterId = req.account?.accountId;
            if (!recruiterId) throw BadResquestError("Bạn chưa đăng nhập")

            const { id } = req.params;
            if (!id) throw new BadResquestError("Thiếu id của công việc");

            await CompanyService.deleteCompany(id, recruiterId);
            res.status(200).json({status: 'success', message: 'Xóa công ty thành công'});
        } catch (error) {
            next(error);
        }
    }
}

export default CompanyController;