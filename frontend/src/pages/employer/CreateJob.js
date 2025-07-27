import React, { useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        jobTitle: "",
        salaryMin: "",
        salaryMax: "",
        employmentType: "Full-time",
        address: {
            line: "",
            city: "",
            country: ""
        },
        skills: "",
        jobExpertise: "",
        jobDomain: "",
        description: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: { ...prev.address, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
            jobExpertise: formData.jobExpertise.split(",").map((s) => s.trim()).filter(Boolean),
            jobDomain: formData.jobDomain.split(",").map((s) => s.trim()).filter(Boolean),
            salaryMin: Number(formData.salaryMin),
            salaryMax: Number(formData.salaryMax),
        };

        try {
            await JobService.createJob(payload, user.accessToken);
            alert("✅ Tạo job thành công!");
            navigate("/employer/dashboard");
        } catch (err) {
            console.error("❌ Lỗi khi tạo job:", err);
            alert("Tạo job thất bại");
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4 text-center">Tạo công việc mới</h2>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Tên công việc</label>
                        <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Vị trí tuyển dụng</label>
                        <input type="text" className="form-control" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Lương tối thiểu</label>
                        <input type="number" className="form-control" name="salaryMin" value={formData.salaryMin} onChange={handleChange} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Lương tối đa</label>
                        <input type="number" className="form-control" name="salaryMax" value={formData.salaryMax} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Địa chỉ cụ thể</label>
                        <input type="text" className="form-control" name="address.line" value={formData.address.line} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Thành phố</label>
                        <input type="text" className="form-control" name="address.city" value={formData.address.city} onChange={handleChange} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Quốc gia</label>
                        <input type="text" className="form-control" name="address.country" value={formData.address.country} onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Kỹ năng (phân cách bằng dấu phẩy)</label>
                    <textarea className="form-control" name="skills" value={formData.skills} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Chuyên môn (phân cách bằng dấu phẩy)</label>
                    <textarea className="form-control" name="jobExpertise" value={formData.jobExpertise} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Lĩnh vực (phân cách bằng dấu phẩy)</label>
                    <textarea className="form-control" name="jobDomain" value={formData.jobDomain} onChange={handleChange} />
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Loại công việc</label>
                        <select className="form-select" name="jobType" value={formData.jobType} onChange={handleChange}>
                            <option value="">Chọn loại công việc</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Hạn nộp hồ sơ</label>
                        <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Mô tả công việc</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="5"
                        placeholder="Nhập mô tả công việc chi tiết..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Đăng tin</button>
            </form>
        </div>
    );
};

export default CreateJob;