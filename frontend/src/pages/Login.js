import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('candidate');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password, role, navigate);
        } catch (error) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm" style={{ borderRadius: '10px', backgroundColor: '#fffbed' }}>
                        <h2 className="text-center mb-4" style={{ color: '#0D5EA6', fontWeight: 'bold' }}>Đăng nhập</h2>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="mb-3">
                            <label className="form-label me-3">Vai trò:</label>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    name="role"
                                    value="candidate"
                                    checked={role === 'candidate'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="form-check-input"
                                    id="candidate"
                                />
                                <label className="form-check-label" htmlFor="candidate">Ứng viên</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={role === 'recruiter'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="form-check-input"
                                    id="recruiter"
                                />
                                <label className="form-check-label" htmlFor="recruiter">Nhà tuyển dụng</label>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Nhập email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">
                                Đăng nhập
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <Link to="/register" className="text-decoration-none">
                                Chưa có tài khoản? Đăng ký ngay
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;