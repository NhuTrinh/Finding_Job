
import CompanyService from "./company.service.js";
import RecruiterDAO from "../dao/recruiter.dao.js";
import AccountDao from "../dao/account.dao.js";

class RecruiterService {
    static async createRecruiter({accountId, company: {name, address: {line, city, country}}}) {

        // Tạo công ty 
        const newCompany = await CompanyService.createCompany({
            accountId: accountId,
            name,
            address: {
                line,
                city,
                country
            }
        });

        // Đăng ký recruiter và gán company
        const newRecruiter = await RecruiterDAO.create({accountId, companyId: newCompany._id});

        return newRecruiter;
    }

    static async getProfile(accountId) {
        //1. Kiểm tra tài khoản hợp lệ
        const account = await AccountDao.findById(accountId);
        if (!account) throw new InvalidCredentialsError("Bạn cần đăng nhập");

        // 2. Lấy thông tin nhà tuyển dụng
        const recruiter = await RecruiterDAO.findOne({ accountId })
        if (!recruiter) throw new NotFoundError("Không tìm thấy hồ sơ nhà tuyển dụng");

        return {
            fullName: account.fullName,
            email: account.email,
            recruiter
        }
    }

    static async updateProfile(accountId, newProfile) {
        // 1. Kiểm tra tài khoản hợp lệ
        const account = await AccountDao.findById(accountId);
        if (!account) {
            throw new InvalidCredentialsError("Bạn cần đăng nhập");
        }

        // 2. Cập nhật fullName nếu có
        const { fullName, ...recruiterFields } = newProfile;

        if (fullName && fullName !== account.fullName) {
            account.fullName = fullName;
            await account.save();
        }

        // 3. Lấy recruiter
        const recruiter = await RecruiterDAO.findOne({ accountId });
        if (!recruiter) {
            throw new NotFoundError("Không tìm thấy hồ sơ nhà tuyển dụng");
        }

        // 4. Cập nhật các trường recruiter
        Object.assign(recruiter, recruiterFields);
        await recruiter.save();

        // 5. Trả lại dữ liệu sau cập nhật
        return {
            fullName: account.fullName,
            email: account.email,
            recruiter
        };
    }    
}

export default RecruiterService;