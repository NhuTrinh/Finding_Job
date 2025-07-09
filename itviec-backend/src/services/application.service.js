
import ApplicationDao from "../dao/application.dao.js";
import CandidateDao from "../dao/candidate.dao.js";
import RecruiterDao from "../dao/recruiter.dao.js";
import JobDao from "../dao/job.dao.js";
import ConflictError from "../shared/exceptions/ConflictError.js";
import ForbiddenError from "../shared/exceptions/ForbiddenError.js";
import InvalidCredentialsError from "../shared/exceptions/InvalidCredentialsError.exception.js";
import NotFoundError from "../shared/exceptions/NotFoundError.exception.js";
import StatusApplication from "../shared/constants/statusApplication.enum.js";
import statusApplicationEnum from "../shared/constants/statusApplication.enum.js";

export default class ApplicationService {

    /*  ====== 1.CANDIDATE =====*/
    static async applyJob(jobId, candidateId) {
        const candidate = await CandidateDao.findOne({accountId: candidateId});
        if (!candidate) throw new InvalidCredentialsError("Bạn cần đăng nhập để ứng tuyển");

        const job = await JobDao.findById(jobId);
        if (!job) throw new NotFoundError("Không tìm thấy công việc");

        const existing = await ApplicationDao.findOne({ jobId: jobId, candidateId: candidate._id })
        if (existing) throw new ConflictError("Bạn đã ứng tuyển công việc này rồi")

        return await ApplicationDao.create({ 
            jobId: jobId, 
            candidateId: candidate._id,
            status: StatusApplication.SUBMITTED
        });
    }

    static async candidateGetApplications(candidateId) {
        const candidate = await CandidateDao.findOne({ accountId: candidateId });
        if (!candidate) throw new InvalidCredentialsError("Thông tin ứng viên không đúng");

        const applications = await ApplicationDao.findByCandidateId(candidate._id, {
            populate: [
                {
                    path: "jobId",
                    populate: {
                        path: "companyId", // Lồng thêm tên công ty
                        select: "name"
                    },
                    select: "jobTitle salaryMin salaryMax address companyId"
                }
            ]
        });

        return applications;
    }    

    static async candidateCancelApplication(id, candidateId) {
        const candidate = await CandidateDao.findOne({accountId: candidateId});
        if (!candidate) throw new InvalidCredentialsError("Thông tin đăng nhập không chính xác");

        const application = await ApplicationDao.findById(id);
        if (!application) throw new NotFoundError('Không tìm thấy đơn ứng tuyển');

        if (!application.candidateId.equals(candidate._id)){
            throw new ForbiddenError("Bạn không được hủy đơn ứng tuyển không phải của mình");
        }

        return await ApplicationDao.deleteById(id);
    }

    /*  ====== 2.RECRUITER =====*/
    static async recruiterGetApplications(recruiterId) {

        // 1. Tìm recruiter theo accountId
        const recruiter = await RecruiterDao.findOne({ accountId: recruiterId });
        if (!recruiter) throw new InvalidCredentialsError("Thông tin đăng nhập không chính xác");

        // 2. Tìm tất cả job mà recruiter đó đăng tuyển
        const jobs = await JobDao.findAllByRecruiterId(recruiter._id);
        const jobIds = jobs.map(job => job._id);
        if (jobIds.length === 0) return [];

        // 3. Tìm tất cả application ứng tuyển vào những job đó
        const applications = await ApplicationDao.findMany({ jobId: { $in: jobIds } });
        return applications;
    }

    static async recruiterAcceptApplication(id, recruiterId)  {
        await ApplicationService._updateApplicationStatus(id, recruiterId, StatusApplication.ACCEPT);
    } 

    static async recruiterRejectApplication(id, recruiterId) {
        await ApplicationService._updateApplicationStatus(id, recruiterId, StatusApplication.REJECTED);
    } 
    
    static async _updateApplicationStatus(id, recruiterId, newStatus) {
        // 1. Tìm recruiter theo accountId
        const recruiter = await RecruiterDao.findOne({ accountId: recruiterId });
        if (!recruiter) {
            throw new InvalidCredentialsError("Thông tin đăng nhập không chính xác");
        }

        // 2. Tìm đơn ứng tuyển
        const application = await ApplicationDao.findById(id);
        if (!application) {
            throw new NotFoundError("Không tìm thấy đơn ứng tuyển");
        }

        // 3. Tìm công việc tương ứng
        const job = await JobDao.findById(application.jobId);
        if (!job) {
            throw new NotFoundError("Không tìm thấy công việc liên quan đến đơn ứng tuyển");
        }

        // 4. Kiểm tra quyền truy cập
        if (job.recruiterId.toString() !== recruiter._id.toString()) {
            throw new ForbiddenError("Bạn không có quyền cập nhật đơn ứng tuyển này");
        }

        // 5. Cập nhật trạng thái đơn ứng tuyển
        const updatedApplication = await ApplicationDao.updateById(id, {
            status: newStatus,
        });

        return updatedApplication;
    }    
}