
import Candidate from "../models/candidate.model.js"
import BaseDAO from "../shared/dao/base.dao.js";


class CandidateDAO extends BaseDAO {
    constructor(){
        super(Candidate);
    }

    async findProfileByAccountId(accountId) {
        return Candidate
        .findOne({accountId}, {profile: 1});
    }

    async findAttachmentsByAccountId(accountId) {
        return Candidate
        .findOne({accountId}, {attachments: 1});
    }
}

export default new CandidateDAO();