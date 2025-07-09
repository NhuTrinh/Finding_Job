import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const DEFAULT_EXPIRY = process.env.JWT_EXPIRES_IN || '1d';

const signToken = (payload, expiresIn = DEFAULT_EXPIRY) => {
    return jwt.sign(payload, JWT_SECRET, {expiresIn});
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; // hoặc throw err tùy cách xử lý
  }
};

export {signToken, verifyToken};