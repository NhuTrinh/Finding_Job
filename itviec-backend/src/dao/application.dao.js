
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

    async findMany(filter) {
        return Application.find(filter).populate('jobId').populate('candidateId');
    }
}

export default new ApplicationDAO();