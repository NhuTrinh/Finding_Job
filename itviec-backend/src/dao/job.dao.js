
import Job from "../models/job.model.js"
import BaseDAO from "../shared/dao/base.dao.js";

class JobDAO extends BaseDAO {
    constructor() {
        super(Job);
    }

    async findAllByRecruiterId(recruiterId) {
        return Job.find({ recruiterId });
    }
}

export default new JobDAO();