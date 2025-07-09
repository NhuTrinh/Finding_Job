
import BaseDAO from "../shared/dao/base.dao.js"
import Company from "../models/company.model.js";

class CompanyDAO extends BaseDAO{
    constructor(){
        super(Company);
    }
}

export default new CompanyDAO();