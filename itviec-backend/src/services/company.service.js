
import CompanyDAO from "../dao/company.dao.js"
import AccountDao from "../dao/account.dao.js"
import NotFoundError from "../shared/exceptions/NotFoundError.exception.js";
import ForbiddenError from "../shared/exceptions/ForbiddenError.js";

class CompanyService {
    
    static async createCompany({ accountId, name, address }) {
        const recruiter = await AccountDao.findById(accountId);
        if (!recruiter) {
            throw new InvalidCredentialsError("Bạn cần đăng nhập");
        }

        const { line, city, country } = address || {};
        return CompanyDAO.create({
            createBy: accountId,
            name,
            address: { line, city, country }
        });
    }

    static async getCompanies() {
        return CompanyDAO.findAll();
    }

    static async getCompanyById(companyId) {
        const company = await CompanyDAO.findById(companyId);
        if (!company) {
            throw new NotFoundError("Không tìm thấy công ty");
        }
        return company;
    }

    static async updateCompany(companyId, updateData, recruiterId) {
        const company = await CompanyDAO.findById(companyId);
        if (!company) {
            throw new NotFoundError("Không tìm thấy công ty");
        }
       
        if(company.createBy.toString() !== recruiterId.toString()){
            throw new ForbiddenError("Bạn không được phép cập nhật công ty không phải của mình");
        }

        const updated = await CompanyDAO.updateById(companyId, updateData);

        return updated;
    }

    static async deleteCompany(companyId, recruiterId) {
        const company = await CompanyDAO.findById(companyId);
        if (!company) {
            throw new NotFoundError("Không tìm thấy công ty");
        }

        if (!company.createBy.equals(recruiterId)) {
            throw new ForbiddenError("Bạn không được phép xóa công ty không phải của mình");
        }

        await CompanyDAO.deleteById(companyId);
    }
}

export default CompanyService;