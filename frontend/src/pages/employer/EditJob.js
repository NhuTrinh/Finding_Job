import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobService from '../../services/JobService';
import { AuthContext } from '../../contexts/AuthContext';


const EditJob = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        minSalary: '',
        maxSalary: '',
        type: '',
        address: {
            line: '',
            city: '',
            country: ''
        }
    });

    useEffect(() => {
        JobService.getJobById(id).then(res => {
            setJob(res.data);
            setForm(res.data);
        });
    }, [id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };



    const handleUpdate = async (e) => {
        e.preventDefault();
        await JobService.updateJob(id, form, user.accessToken);
        navigate(`/employer/jobs/${id}`);
    };



    if (!job) return <div className="text-center mt-5">Đang tải...</div>;

    return (
        <div className="container my-5">
            <div className="card shadow-lg p-4 rounded-4">
                <h2 className="text-center mb-4 text-primary fw-bold">Cập nhật tin tuyển dụng</h2>
                <form onSubmit={handleUpdate}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Tiêu đề công việc</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

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

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Hình thức</label>
                            <select
                                name="type"
                                className="form-select"
                                value={form.type}
                                onChange={handleChange}
                            >
                                <option value="">-- Chọn hình thức --</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Địa chỉ cụ thể</label>
                            <input
                                type="text"
                                name="line"
                                className="form-control"
                                value={form.address.line}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Thành phố</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                value={form.address.city}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">Quốc gia</label>
                            <input
                                type="text"
                                name="country"
                                className="form-control"
                                value={form.address.country}
                                onChange={handleChange}
                            />
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
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold rounded-3">
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditJob;