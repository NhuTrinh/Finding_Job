import React, { useState, useContext } from 'react';
import axios from 'axios';


export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });



    const login = async (email, password, role, navigate) => {
        try {
            const endpoint =
                role === 'candidate'
                    ? '/accounts/candidate/login'
                    : '/accounts/recruiter/login';

            const res = await fetch(`http://localhost:80/api/v1${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error('Đăng nhập thất bại');

            const data = await res.json();
            const { accessToken } = data;

            const userData = { email, role, accessToken };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            if (role === 'candidate') {
                navigate('/candidate/dashboard');
            } else {
                navigate('/employer/dashboard');
            }
        } catch (err) {
            console.error(err);
            alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
        }
    };

    const register = async ({ fullName, email, password, company }) => {
    try {
      const response = await axios.post('http://localhost:80/api/v1/accounts/recruiter/register', {
        fullName,
        email,
        password,
        company,
      });

      // Có thể đăng nhập luôn nếu API trả về user
      setUser(response.data.user); // hoặc response.data nếu bạn muốn

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Xử lý lỗi từ server
        throw new Error(error.response.data.message || 'Đăng ký thất bại');
      }
      throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };


    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };



    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};