
import Account from "../models/account.model.js"
import BaseDAO from "../shared/dao/base.dao.js";

class AccountDAO extends BaseDAO {
    constructor(){
        super(Account);
    }
}

export default new AccountDAO();