
import BaseDAO from "../shared/dao/base.dao.js";
import Recruiter from "../models/recruiter.model.js";

class RecruiterDAO extends BaseDAO {
    constructor(){
        super(Recruiter);
    }
}

export default new RecruiterDAO();