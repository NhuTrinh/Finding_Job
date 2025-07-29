
import Application from "../models/application.model.js"
import BaseDAO from "../shared/dao/base.dao.js";

class ApplicationDAO extends BaseDAO {
    constructor() {
        super(Application);
    }

    async findByCandidateId(candidateId, options = {}) {
        return Application.find({ candidateId })
            .populate(options.populate || []);
    }      

    /* async findMany(filter) {
        return Application.find(filter).populate('jobId').populate('candidateId');
    } */
    
    async findMany(filter) {
    return Application.find(filter)
        .populate('jobId') // để lấy job title, etc.
        .populate({
            path: 'candidateId',
            populate: {
                path: 'accountId',
                select: 'email fullName' // chỉ lấy field cần thiết
            }
        });
}
}

export default new ApplicationDAO();