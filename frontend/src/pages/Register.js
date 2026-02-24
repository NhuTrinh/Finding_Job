import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CompanyService from "../services/CompanyService";

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        addressLine: '',
        city: '',
        country: 'Việt Nam'
    });

    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        CompanyService.getAllCompanies()
            .then(res => {
                setCompanies(res.data.data);
                console.log("Danh sách công ty:", res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi khi lấy danh sách công ty:", err);
                setLoading(false);
            });
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setFormErrors(prev => ({
            ...prev,
            [name]: '' // Xoá lỗi của field đang nhập
        }));

        setError(''); // Xoá lỗi tổng quát nếu có
    };

    const isFormEmpty = Object.values(formData).every(value => value.trim() === '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        const { fullName, email, password, confirmPassword, companyName, addressLine, city, country } = formData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (Object.values(formData).every(value => value.trim() === '')) {
            setFormErrors({ general: 'Vui lòng điền đầy đủ thông tin trước khi đăng ký!' });
            return;
        }

        if (!fullName.trim()) newErrors.fullName = 'Họ và tên không được để trống!';
        if (!email.trim()) newErrors.email = 'Email không được để trống!';
        else if (!emailRegex.test(email)) newErrors.email = 'Email không hợp lệ!';
        if (!password.trim()) newErrors.password = 'Mật khẩu không được để trống!';
        else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự!';
        if (!confirmPassword.trim()) newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống!';
        else if (confirmPassword.length < 6) newErrors.confirmPassword = 'Xác nhận mật khẩu phải có ít nhất 6 ký tự!';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp!';
        if (!companyName.trim()) newErrors.companyName = 'Tên công ty không được để trống!';
        if (!addressLine.trim()) newErrors.addressLine = 'Địa chỉ không được để trống!';
        if (!city.trim()) newErrors.city = 'Thành phố không được để trống!';
        if (!country.trim()) newErrors.country = 'Quốc gia không được để trống!';

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }
        setFormErrors({});

        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            company: {
                id: parseInt(formData.companyName), 
                address: {
                    line: formData.addressLine,
                    city: formData.city,
                    country: formData.country
                }
            }
        };

        try {
            console.log("Dữ liệu gửi đi:", payload);
            // Gọi hàm register từ AuthContext
            await register(payload);

            // Reset form sau khi đăng ký
            setFormData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
                companyName: '',
                addressLine: '',
                city: '',
                country: ''
            });
            setSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
            setTimeout(() => {
                navigate('/employer/login');
            }, 3000);
        } catch (err) {
            if (err.errors) {
                setFormErrors(err.errors);
            } else {
                setError(err.message || 'Đăng ký thất bại');
            }
        }
    };

    const cities = [
        "Hà Nội",
        "TP. Hồ Chí Minh",
        "Đà Nẵng",
        "Cần Thơ",
    ];

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-center mb-4" style={{ color: '#0D5EA6', fontWeight: 'bold' }}>Tạo tài khoản mới</h2>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#91C8E4', borderRadius: '20px', padding: '20px' }}>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && (
                    <div className="alert alert-success">
                        {success} <br />
                        Bạn sẽ được chuyển sang trang đăng nhập trong giây lát...
                    </div>
                )}

                <div className="mb-2">
                    <label className="form-label" style={{ color: 'black' }}>Họ và tên <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} onFocus={() => {
                        setError('');
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                    }} />
                    {formErrors.fullName && <div className="text-danger">{formErrors.fullName}</div>}
                </div>

                <div className="mb-2">
                    <label className="form-label" style={{ color: 'black' }}>Email <span style={{ color: 'red' }}>*</span></label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} onFocus={() => {
                        setError('');
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                    }} />
                    {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                </div>

                <div className="mb-2">
                    <label className="form-label" style={{ color: 'black' }}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                    <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} onFocus={() => {
                        setError('');
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                    }} />
                    {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
                </div>

                <div className="mb-2">
                    <label className="form-label" style={{ color: 'black' }}>Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span></label>
                    <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => {
                        setError('');
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                    }} />
                    {formErrors.confirmPassword && <div className="text-danger">{formErrors.confirmPassword}</div>}
                </div>

                <div className="mb-2">
                    <label className="form-label" style={{ color: "black" }}>
                        Tên công ty <span style={{ color: "red" }}>*</span>
                    </label>

                    <select
                        className="form-control"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        onFocus={() => {
                            setError("");
                            setFormErrors((prev) => ({ ...prev, companyName: "" }));
                        }}
                    >
                        <option value="">-- Chọn công ty --</option>

                        {companies.map((company) => (
                            <option key={company._id} value={company._id}>
                                {company.name}
                            </option>
                        ))}
                    </select>

                    {formErrors.companyName && (
                        <div className="text-danger">{formErrors.companyName}</div>
                    )}
                </div>

                <div className="mb-2">
                    <label className="form-label" style={{ color: 'black' }}>Địa chỉ (số nhà, đường) <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-control" name="addressLine" value={formData.addressLine} onChange={handleChange} onFocus={() => {
                        setError('');
                        setFormErrors(prev => ({ ...prev, fullName: '' }));
                    }} />
                    {formErrors.addressLine && <div className="text-danger">{formErrors.addressLine}</div>}
                </div>

                <div className="mb-2">
                    <label className="form-label" style={{ color: "black" }}>
                        Thành phố <span style={{ color: "red" }}>*</span>
                    </label>

                    <select
                        className="form-control"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onFocus={() => {
                            setError("");
                            setFormErrors((prev) => ({ ...prev, city: "" }));
                        }}
                    >
                        <option value="">-- Chọn thành phố --</option>

                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    {formErrors.city && (
                        <div className="text-danger">{formErrors.city}</div>
                    )}
                </div>

                <div className="mb-3">
                    <label className="form-label" style={{ color: "black" }}>
                        Quốc gia <span style={{ color: "red" }}>*</span>
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        name="country"
                        value={formData.country}
                        disabled
                    />

                    {formErrors.country && (
                        <div className="text-danger">{formErrors.country}</div>
                    )}
                </div>

                <button type="submit" className="btn w-100" style={{ backgroundColor: '#0D5EA6', color: 'white' }} disabled={isFormEmpty}>
                    Đăng ký
                </button>

                <div className="text-center mt-3">
                    <Link to="/employer/login" className="text-decoration-none" style={{ fontWeight: 'bold' }}>
                        Đã có tài khoản? Đăng nhập ngay
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;