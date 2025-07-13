import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('recruiter'); // Mặc định là nhà tuyển dụng
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'recruiter'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        setFormErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '' // Xóa lỗi khi người dùng nhập dữ liệu
        }));

        setError(''); // Xóa lỗi chung khi người dùng nhập dữ liệu
    };

    const isFormEmpty = Object.values(formData).every((value) => value.trim() === '');



    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        const { email, password, role } = formData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (Object.values(formData).every((value) => value.trim() === '')) {
            setError('Vui lòng điền đầy đủ thông tin đăng nhập.');
            return;
        }

        if (!email.trim()) {
            newErrors.email = 'Email không được để trống';
        }
        else if (!emailRegex.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!password.trim()) {
            newErrors.password = 'Mật khẩu không được để trống';
        }

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        setFormErrors({});

        try {
            await login(email, password, role, navigate);
            setSuccessMessage('Đăng nhập thành công!');
        } catch (error) {
            if (error.errors) {
                setFormErrors(error.errors);
            } else {
                setError(error.message || 'Đăng nhập thất bại');
            }
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4" style={{ color: "#0D5EA6", fontWeight: "bold" }}>
                Đăng nhập
            </h2>

            <form
                onSubmit={handleSubmit} noValidate
                style={{
                    backgroundColor: "#91C8E4",
                    borderRadius: "20px",
                    padding: "20px",
                }}
            >
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {/* Role selection */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: "black" }}>
                        Vai trò <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="form-check form-check-inline">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="role"
                            value="candidate"
                            checked={formData.role === "candidate"}
                            onChange={handleChange}
                            id="candidate"
                        />
                        <label className="form-check-label" htmlFor="candidate">Ứng viên</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="role"
                            value="recruiter"
                            checked={formData.role === "recruiter"}
                            onChange={handleChange}
                            id="recruiter"
                        />
                        <label className="form-check-label" htmlFor="recruiter">Nhà tuyển dụng</label>
                    </div>
                </div>

                {/* Email input */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: "black" }}>
                        Email <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => {
                            setError("");
                            setFormErrors((prev) => ({ ...prev, email: "" }));
                        }}
                    />
                    {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </div>

                {/* Password input */}
                <div className="mb-3">
                    <label className="form-label" style={{ color: "black" }}>
                        Mật khẩu <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => {
                            setError("");
                            setFormErrors((prev) => ({ ...prev, password: "" }));
                        }}
                    />
                    {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="btn w-100"
                    style={{ backgroundColor: "#0D5EA6", color: "white" }}
                    disabled={isFormEmpty}
                >
                    Đăng nhập
                </button>

                {/* Link to register */}
                <div className="text-center mt-3">
                    <Link to="/register" className="text-decoration-none" style={{ fontWeight: "bold" }}>
                        Chưa có tài khoản? Đăng ký ngay
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Login;