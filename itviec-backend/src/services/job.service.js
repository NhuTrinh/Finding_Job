
import CompanyDao from "../dao/company.dao.js";
import Job from "../models/job.model.js";
import NotFoundError from "../shared/exceptions/NotFoundError.exception.js";
import ConflictError from "../shared/exceptions/ConflictError.js";
import ForbiddenError from "../shared/exceptions/ForbiddenError.js";
import JobDao from "../dao/job.dao.js";

export default class JobService {
    static async createJob(data) {
        const { title, companyId } = data;

        // 1. Kiểm tra company tồn tại
        const company = await CompanyDao.findById(companyId);
        if (!company) {
            throw new NotFoundError('Công ty không tồn tại.');
        }

        // 2. Kiểm tra job đã tồn tại
        const existingJob = await JobDao.findOne({ title, companyId });
        if (existingJob) {
            throw new ConflictError('Bạn đã thêm công việc này rồi.');
        }

        // 3. Tạo job
        return JobDao.create(data);
    }

    static async getJobs({ filters = {}, page = 0, jobsPerPage = 20 } = {}) {

        const query = {};

        if (filters.search) {
            query.$text = { $search: filters.search };
        }

        if (filters.city) {
            query['address.city'] = { $regex: `^${filters.city}$`, $options: 'i' };
        }

        try {
            const jobsList = await Job.find(query)
                .skip(jobsPerPage * page)
                .limit(jobsPerPage)
                .lean()
                .exec();

            const totalNumJobs = await Job.countDocuments(query).exec();

            return { jobsList, totalNumJobs };
        } catch (e) {
            console.error(`unable to issue find command, ${e}`);
            return { jobList: [], totalNumberJobs: 0 };
        }
    }

    static async getJobById(id) {
        const job = await JobDao.findById(id)
        if (!job) throw new NotFoundError("Không tìm thấy công việc");
        return job;
    }

    static async getJobsByRecruiter(recruiterId) {
        const job = await JobDao.find({ recruiterId });
        if (!job || job.length === 0) {
            throw new NotFoundError("Không tìm thấy công việc");
        }

        return job;
    }

    static async updateJob(id, jobData, recruiterId) {
        const job = await JobDao.findById(id);
        if (!job) throw new NotFoundError("Không tìm thấy công việc");

        if (!job.recruiterId.equals(recruiterId)) {
            throw new ForbiddenError("Bạn không có quyền sửa công việc này");
        }

        const updatedJob = await JobDao.updateById(id, jobData);
        return updatedJob;
    }

    static async deleteJob(id, recruiterId) {
        const job = await JobDao.findById(id);
        if (!job) throw new NotFoundError("Không tìm thấy công việc");

        if (!job.recruiterId.equals(recruiterId)) {
            throw new ForbiddenError("Bạn không có quyền xóa công việc này");
        }

        await JobDao.deleteById(id);
    }
}