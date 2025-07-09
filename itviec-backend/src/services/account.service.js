import EmailAlreadyExistsError from "../shared/exceptions/EmailAlreadyExistsError.exception.js";
import InvalidCredentialsError from "../shared/exceptions/InvalidCredentialsError.exception.js";
import AccountDAO from "../dao/account.dao.js";
import { hashPassword, comparePassword } from "../shared/utils/hash.util.js";
import dotenv from 'dotenv';
import Role from "../shared/constants/role.enum.js";
import { signToken } from "../shared/utils/token.util.js";
import RecruiterService from "../services/recruiter.service.js";
import CandidateService from "./candidate.service.js";
import ForbiddenError from "../shared/exceptions/ForbiddenError.js";

dotenv.config();

class AccountService {

    /*  1. ===== RESGISTER ===== */
    static async _createBaseAccount({fullName, email, password, role}) {
        const existingEmail = await AccountDAO.findByEmail(email);
        if(existingEmail) throw new EmailAlreadyExistsError();

        const hashed = await hashPassword(password);
        const newAccount = await AccountDAO.create({
            fullName, 
            email, 
            password: hashed,
            role
        });
        
        return {
            id: newAccount._id,
            fullName: newAccount.fullName,
            email: newAccount.email, 
            role: newAccount.role,
        };
    }

    static async registerCandidate({fullName, email, password}) {
        const newAccount = await this._createBaseAccount({fullName, email, password, role: Role.CANDIDATE});

        await CandidateService.createCandidate(newAccount.id);
        return newAccount;
    };

    static async registerRecruiter({fullName, email, password, company: {name, address: {line, city, country}}}){
        const newAccount = await this._createBaseAccount({fullName, email, password, role: Role.RECRUITER});

        await RecruiterService.createRecruiter({accountId: newAccount.id, company: {name, address: {line, city, country}}});
        
        return newAccount;
    }

    /* 2. ===== LOGIN ===== */
    static async _loginWithRole(email, password, requiredRole) {
        const existingAccount = await AccountDAO.findByEmail(email);
        if (!existingAccount) throw new InvalidCredentialsError();

        if (existingAccount.role !== requiredRole) {
            throw new ForbiddenError('Bạn không được phép truy cập');
        }

        const isPassword = await comparePassword(password, existingAccount.password);
        if (!isPassword) throw new InvalidCredentialsError();

        const payload = {
            accountId: existingAccount._id,
            email: existingAccount.email,
            role: existingAccount.role
        };

        return signToken(payload);
    }

    static async candidateLogin(email, password) {
        return this._loginWithRole(email, password, Role.CANDIDATE);
    }

    static async recruiterLogin(email, password) {
        return this._loginWithRole(email, password, Role.RECRUITER);
    }
}

export default AccountService;