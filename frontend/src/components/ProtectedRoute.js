import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Chưa đăng nhập
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Đăng nhập sai vai trò
    return <Navigate to="/unauthorized" replace />;
  }

  // Đúng role và đã đăng nhập => Cho phép truy cập
  return children;
};

export default ProtectedRoute;