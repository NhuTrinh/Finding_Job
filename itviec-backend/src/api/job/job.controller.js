
import JobService from "../../services/job.service.js";
import { apiSuccess } from "../../shared/helpers/apiResponse.helper.js";
import RecruiterDao from "../../dao/recruiter.dao.js";
import ForbiddenError from "../../shared/exceptions/ForbiddenError.js";
import BadResquestError from "../../shared/exceptions/BadrequestError.js";

export default class JobController {
  // 1. Tính năng thêm mới công việc
  static async apiAddJob(req, res, next) {
    try {
      const accountId = req.account?.accountId;
      const recruiter = await RecruiterDao.findOne({ accountId });

      const jobData = {
        ...req.body,
        recruiterId: recruiter._id,
        companyId: recruiter.companyId
      }

      const response = await JobService.createJob(jobData);
      return apiSuccess(res, response, 201);
    } catch (error) {
      next(error);
    }
  }

  // 2 + 3. Tính năng xem danh sách và tìm kiếm công việc
  static async apiGetJobs(req, res, next) {
    try {
      const jobsPerPage = req.query.jobsPerPage ? parseInt(req.query.jobsPerPage) : 20;
      const page = req.query.page ? parseInt(req.query.page) : 0;
      let filters = {};

      if (req.query.search) {
        filters.search = req.query.search.trim();
      }
      if (req.query.city) {
        filters.city = req.query.city.trim();
      }

      const { jobsList, totalNumJobs } = await JobService.getJobs({
        filters, page, jobsPerPage
      });

      let response = {
        jobs: jobsList,
        page: page,
        filters: filters,
        entries_per_page: jobsPerPage,
        total_results: totalNumJobs
      };

      return apiSuccess(res, response, 200);
    } catch (error) {
      next(error);
    }
  }

  // 4. Tính năng xem chi tiết công việc 
  static async apiGetJobById(req, res, next) {
    try {
      const { id } = req.params
      const response = await JobService.getJobById(id);
      return apiSuccess(res, response, 200);
    } catch (error) {
      next(error);
    }
  }

  // 5. Tính năng nhà tuyển dụng lấy danh sách công việc do mình đăng
  static async apiGetJobByRecruiterId(req, res, next) {
    try {
      const accountId = req.account?.accountId;
      const recruiter = await RecruiterDao.findOne({ accountId });

      const response = await JobService.getJobsByRecruiter(recruiter._id);
      return apiSuccess(res, response, 200)
    } catch (error) {
      next(error);
    }
  }

  // 6. Tính năng nhà tuyển dụng sửa công việc
  static async apiUpdateJob(req, res, next) {
    try {
      const accountId = req.account?.accountId;
      const recruiter = await RecruiterDao.findOne({ accountId });
      if (!recruiter) throw new ForbiddenError("Thông tin nhà tuyển dụng k hợp lệ")

      const { id } = req.params;
      if (!id) throw new BadResquestError("Thiếu id của công việc");

      const jobData = req.body;

      const response = await JobService.updateJob(id, jobData, recruiter._id);
      return apiSuccess(res, response, 200);
    } catch (error) {
      next(error);
    }
  }

  // 7. Tính năng nhà tuyển dụng xóa công việc
  static async apiDeleteJob(req, res, next) {
    try {
      const accountId = req.account?.accountId;
      const recruiter = await RecruiterDao.findOne({ accountId });
      if (!recruiter) throw new ForbiddenError("Thông tin nhà tuyển dụng k hợp lệ")

      const { id } = req.params;
      if (!id) throw new BadResquestError("Thiếu id của công việc");

      await JobService.deleteJob(id, recruiter._id);
      res.status(200).json({ status: 'success' })
    } catch (error) {
      next(error);
    }
  }
}