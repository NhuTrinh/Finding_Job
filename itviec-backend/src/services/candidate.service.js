import NotFoundError from "../shared/exceptions/NotFoundError.exception.js";
import AccountDAO from "../dao/account.dao.js";
import CandidateDAO from "../dao/candidate.dao.js";
import InvalidCredentialsError from "../shared/exceptions/InvalidCredentialsError.exception.js";
import ForbiddenError from "../shared/exceptions/ForbiddenError.js";

class CandidateService {

    static async createCandidate(accountId) {
        return await CandidateDAO.create({ accountId });
    }

    // 1. Tính năng ứng viên xem hồ sơ ITVIEC
    static async getProfileByAccountId(accountId) {
        const account = await AccountDAO.findById(accountId);
        if (!account) throw new InvalidCredentialsError("Bạn cần đăng nhập")

        const candidate = await CandidateDAO.findProfileByAccountId(accountId);
        if (!candidate || !candidate.profile) {
            throw new ForbiddenError("Không tìm thấy hồ sơ ứng viên");
        }

        return {
            fullName: account.fullName,
            email: account.email,
            ...candidate.profile
        };
    }

    static async updateProfileByAccountId(accountId, newProfile) {
        const { fullName, ...profileFields } = newProfile;

        // 1. Cập nhật fullName nếu có
        let updatedAccount = null;
        if (fullName) {
            updatedAccount = await AccountDAO.updateById(accountId, { fullName });
        } else {
            updatedAccount = await AccountDAO.findById(accountId);
        }

        if (!updatedAccount) {
            throw new InvalidCredentialsError("Bạn cần đăng nhập");
        }

        console.log("update account:", updatedAccount);

        // 2. Tìm hồ sơ ứng viên
        const candidate = await CandidateDAO.findProfileByAccountId(accountId);
        if (!candidate || !candidate.profile) {
            throw new ForbiddenError("Không tìm thấy hồ sơ ứng viên");
        }

        // 3. Gán thông tin profile mới
        Object.assign(candidate.profile, profileFields);
        await candidate.save();
        

        console.log("candidate profile:", candidate.profile);

        // 4. Trả về dữ liệu sau khi cập nhật
        return {
            fullName: updatedAccount.fullName,
            email: updatedAccount.email,
            ...candidate.profile
        };
    }

    static async getAttachmentsByAccountId(accountId) {
        // 1. Kiểm tra tài khoản hợp lệ
        const account = await AccountDAO.findById(accountId);
        if (!account) {
            throw new InvalidCredentialsError("Bạn cần đăng nhập");
        }

        // 2. Lấy profile ứng viên
        const candidate = await CandidateDAO.findProfileByAccountId(accountId);
        if (!candidate || !candidate.profile) {
            throw new NotFoundError("Không tìm thấy hồ sơ ứng viên");
        }

        // 3. Lấy tệp đính kèm
        const attachmentsDoc = await CandidateDAO.findAttachmentsByAccountId(accountId);
        if (!attachmentsDoc || !attachmentsDoc.attachments) {
            throw new NotFoundError("Không tìm thấy tệp đính kèm của ứng viên");
        }

        // 4. Trả kết quả
        const attachments = typeof attachmentsDoc.attachments.toObject === 'function'
            ? attachmentsDoc.attachments.toObject()
            : attachmentsDoc.attachments;

        return {
            fullName: account.fullName,
            phoneNumber: candidate.profile.phoneNumber,
            ...attachments
        };
    }

    static async updateAttachmentsByAccountId(accountId, newAttachments) {
        // 1. Kiểm tra tài khoản hợp lệ
        const account = await AccountDAO.findById(accountId);
        if (!account) {
            throw new NotFoundError("Không tìm thấy tài khoản");
        }

        // 2. Cập nhật fullName nếu có
        const { fullName, phoneNumber, ...attachmentFields } = newAttachments;

        if (fullName && fullName !== account.fullName) {
            account.fullName = fullName;
            await account.save();
        }

        // 3. Lấy ứng viên
        const candidate = await CandidateDAO.findOne({ accountId });
        if (!candidate || !candidate.profile) {
            throw new NotFoundError("Không tìm thấy ứng viên");
        }

        // 4. Cập nhật phoneNumber nếu có
        if (phoneNumber && phoneNumber !== candidate.profile.phoneNumber) {
            candidate.profile.phoneNumber = phoneNumber;
        }

        // 5. Gán phần còn lại vào attachments
        Object.assign(candidate.attachments, attachmentFields);

        await candidate.save();

        // 6. Trả về kết quả
        const attachments = typeof candidate.attachments.toObject === 'function'
            ? candidate.attachments.toObject()
            : candidate.attachments;

        return {
            fullName: account.fullName,
            phoneNumber: candidate.profile.phoneNumber,
            ...attachments
        };
    }
}

export default CandidateService;