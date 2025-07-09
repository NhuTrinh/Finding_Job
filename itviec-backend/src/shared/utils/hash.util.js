
import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

const comparePassword = async (plain, hashed) => {
    return await bcrypt.compare(plain, hashed);
}

export {hashPassword, comparePassword};