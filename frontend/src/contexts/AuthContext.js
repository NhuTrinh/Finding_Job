import React, { useState, useContext } from 'react';
import AuthService from '../services/AuthService';



export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });



    const login = async (email, password, role, navigate) => {
        try {
            const res = await AuthService.login(email, password, role);
            console.log("RESPONSE DATA:", res.data);
            const accessToken = res.data.token;
            console.log('Login successful:', accessToken);

            const userData = { email, role, accessToken };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            AuthService.setAuthToken(accessToken);
            // Điều hướng sau khi đăng nhập
            if (role === 'candidate') {
                navigate('/candidate/dashboard');
            } else {
                navigate('/employer/dashboard');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                throw new Error(error.response.data.message || 'Đăng nhập thất bại');
            }
            throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
        }
    };

    const register = async (formData) => {
        try {
            const res = await AuthService.register(formData);
            setUser(res.data.user); // hoặc tùy cấu trúc trả về
            return res.data;
        } catch (error) {
            if (error.response && error.response.status === 409) {
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