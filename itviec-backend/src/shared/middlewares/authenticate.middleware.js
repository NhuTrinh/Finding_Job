import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Kiểm tra header có tồn tại và đúng định dạng 'Bearer <token>'
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gán thông tin cần thiết vào req.user
    req.account = {
      email: decoded.email,
      role: decoded.role,
      accountId: decoded.accountId,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message:
        err.name === 'TokenExpiredError'
          ? 'Phiên đăng đã hết hạn. Vui lòng đăng nhập lại.'
          : 'Thông tin đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
    }); 
  }
};

export default authenticate;
