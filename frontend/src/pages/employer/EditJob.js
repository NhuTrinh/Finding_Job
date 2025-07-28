import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobService from '../../services/JobService';
import { AuthContext } from '../../contexts/AuthContext';
import RequireText from '../../components/RequireText.js';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";


const EditJob = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        title: '',
        description: '',
        salaryMax: '',
        salaryMin: '',
        employmentType: '',
        address: {
            line: '',
            city: '',
            country: ''
        }
    });

    useEffect(() => {
        JobService.getJobById(id).then(res => {
            setJob(res.data);
            console.log("Job data:", res.data);
            setForm(res.data);
            console.log(form)
        });
    }, [id]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
        if (!form.employmentType) newErrors.typeMessage = 'Hình thức là bắt buộc';
        if (!form.address.line.trim()) newErrors.line = 'Địa chỉ cụ thể không được để trống';
        if (!form.address.city) newErrors.city = 'Vui lòng chọn thành phố';
        if (!form.address.country) newErrors.country = 'Vui lòng chọn quốc gia';

        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setForm(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };



    const handleUpdate = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        await JobService.updateJob(id, form, user.accessToken);
        navigate('/employer/dashboard');
    };

    const cities = [
        "Hồ Chí Minh",
        "Hà Nội",
        "Đà Nẵng",
        "Cần Thơ",
        "Hải Phòng",
    ];

    const countries = [
        "Việt Nam",
        "Mỹ",
        "Nhật Bản",
        "Hàn Quốc",
        "Trung Quốc"
    ];

    const type = [
        "Full-time",
        "Part-time",
        "Remote"
    ]



    if (!job) return <div className="text-center mt-5">Đang tải...</div>;

    return (
        <div className="container my-5">
            <div className="card shadow-lg p-4 rounded-4">
                <h2 className="text-center mb-4 text-success fw-bold">Cập nhật tin tuyển dụng</h2>
<form onSubmit={handleUpdate}>
    {/* --- Block 1: Thông tin cơ bản --- */}
    <h5 className="fw-bold text-success mt-3">📝 Thông tin cơ bản</h5>
    <hr />
    <div className="row g-3">
        <div className="col-md-6 fw-semibold">
            <RequireText label="Tiêu đề công việc:" />
            <input
                type="text"
                name="title"
                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                value={form.title}
                onChange={handleChange}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>

        <div className="col-12">
            <label className="form-label fw-semibold">Mô tả công việc</label>
            <textarea
                name="description"
                rows="4"
                className="form-control"
                value={form.description}
                onChange={handleChange}
            />
        </div>
    </div>

    {/* --- Block 2: Lương & Hình thức --- */}
    <h5 className="fw-bold text-success mt-4">💰 Lương & Hình thức</h5>
    <hr />
    <div className="row g-3">
        <div className="col-md-6">
            <label className="form-label fw-semibold">Mức lương tối thiểu</label>
            <input
                type="text"
                name="salaryMin"
                className="form-control"
                value={form.salaryMin}
                onChange={handleChange}
            />
        </div>

        <div className="col-md-6">
            <label className="form-label fw-semibold">Mức lương tối đa</label>
            <input
                type="text"
                name="salaryMax"
                className="form-control"
                value={form.salaryMax}
                onChange={handleChange}
            />
        </div>

        <div className="col-md-6 fw-semibold">
            <RequireText label="Hình thức:" />
            <Form.Select
                name="employmentType"
                value={form.employmentType}
                onChange={handleChange}
                className={errors.typeMessage ? 'is-invalid' : ''}
            >
                {type.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                ))}
            </Form.Select>
            {errors.typeMessage && <div className="invalid-feedback">{errors.typeMessage}</div>}
        </div>
    </div>

    {/* --- Block 3: Địa chỉ --- */}
    <h5 className="fw-bold text-success mt-4">📍 Địa chỉ làm việc</h5>
    <hr />
    <div className="row g-3">
        <div className="col-md-6 fw-semibold">
            <RequireText label="Địa chỉ:" />
            <input
                type="text"
                name="address.line"
                className={`form-control ${errors.line ? 'is-invalid' : ''}`}
                value={form.address.line}
                onChange={handleChange}
            />
            {errors.line && <div className="invalid-feedback">{errors.line}</div>}
        </div>

        <div className="col-md-6 fw-semibold">
            <RequireText label="Thành phố:" />
            <Form.Select
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                className={errors.city ? 'is-invalid' : ''}
            >
                {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                ))}
            </Form.Select>
            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
        </div>

        <div className="col-md-6 fw-semibold">
            <RequireText label="Quốc gia:" />
            <Form.Select
                name="address.country"
                value={form.address.country}
                onChange={handleChange}
                className={errors.country ? 'is-invalid' : ''}
            >
                {countries.map((country, index) => (
                    <option key={index} value={country}>{country}</option>
                ))}
            </Form.Select>
            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
        </div>
    </div>

    {/* --- Nút cập nhật --- */}
    <div className="d-flex justify-content-center gap-3 mt-5">
        <button type="submit" className="btn btn-success px-4 py-2 fw-semibold rounded-3">
            Cập nhật
        </button>
    </div>
</form>
            </div>
        </div>
    );
};

export default EditJob;