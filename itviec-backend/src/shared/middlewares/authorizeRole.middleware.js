
const authorizeRole = (role) => {
    return (req, res, next) => {
    if (req.account?.role !== role) {
      return res.status(403).json({ message: 'Forbidden: wrong role' });
    }
    next();
  };
};

export default authorizeRole;