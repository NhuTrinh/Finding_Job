import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import CompanyService from '../../services/CompanyService';
import { AuthContext } from '../../contexts/AuthContext';

const CompanyProfile = ({ companyInfo, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        companyName: companyInfo.companyName || "",
        logo: companyInfo.logo || "",
        companyType: companyInfo.companyType || "",
        industry: companyInfo.industry || "",
        companySize: companyInfo.companySize || "",
        companyLine: companyInfo.companyLine || "",
        companyCity: companyInfo.companyCity || "",
        companyCountry: companyInfo.companyCountry || "",
        companyWorkingTime: companyInfo.companyWorkingTime || "",
        companyOvertime: companyInfo.companyOvertime || "",
        companyAbout: companyInfo.companyAbout || "",
        companySkills: Array.isArray(companyInfo.companySkills)
            ? companyInfo.companySkills
            : companyInfo.companySkills?.split(",") || [],
        companyPerks: companyInfo.companyCulture || "",
        companyFanpage: companyInfo.companyFanpage || "",
        companyWebsite: companyInfo.companyWebsite || "",
    });

    const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};
    const handleSave = () => {
        if (!user?.accessToken || !companyInfo?.companyId) return;

        const updatedData = {
            name: form.companyName,
            logo: form.logo,
            type: form.companyType,
            industry: form.industry,
            size: form.companySize,
            address: {
                line: form.companyLine,
                city: form.companyCity,
                country: form.companyCountry,
            },
            workingDays: form.companyWorkingTime,
            Overtime: form.companyOvertime,
            overview: form.companyAbout,
            keySkills: form.companySkills, // Mảng string
            perksContent: form.companyPerks,
            fanpageUrl: form.companyFanpage,
            websiteUrl: form.companyWebsite,
        };

        CompanyService.updateCompany(companyInfo.companyId, updatedData, user.accessToken)
            .then(() => {
                console.log('✅ Cập nhật công ty thành công');
                setShowModal(false);
                window.location.reload(); // hoặc gọi callback nếu cần
            })
            .catch((err) => console.error('❌ Lỗi cập nhật công ty:', err));
    };

    if (!companyInfo) return null;

    return (
        <div className="card p-4">
            <h4 className="mb-4">🏢 Thông tin công ty</h4>
            <p><strong>Công ty:</strong> {companyInfo.companyName}</p>
            <p><strong>Loại hình:</strong> {companyInfo.companyType}</p>
            <p><strong>Địa chỉ:</strong> {companyInfo.companyLine}, {companyInfo.companyCity}, {companyInfo.companyCountry}</p>
            <p><strong>Giới thiệu:</strong> {companyInfo.companyAbout}</p>
            <p><strong>Website:</strong> <a href={companyInfo.companyWebsite} target="_blank" rel="noopener noreferrer">{companyInfo.companyWebsite}</a></p>
            <p><strong>Fanpage:</strong> <a href={companyInfo.companyFanpage} target="_blank" rel="noopener noreferrer">{companyInfo.companyFanpage}</a></p>
            <p><strong>Quy mô nhân sự:</strong> {companyInfo.companySize}</p>
            <p><strong>Overtime:</strong> {companyInfo.companyOvertime}</p>
            <p><strong>Thời gian làm việc:</strong> {companyInfo.companyWorkingTime}</p>
            <p><strong>Kỹ năng:</strong> </p>
            <div>
                {companyInfo.companySkills.map((skill, idx) => (
                    <span key={idx} className="badge bg-primary me-2 mb-1">{skill}</span>
                ))}
            </div>
            <p><strong>Ngày thành lập:</strong> {companyInfo.foundedYear}</p>
            <p><strong>Ngành nghề:</strong> {companyInfo.industry}</p>
            <p><strong>Slogan:</strong> "{companyInfo.slogan}"</p>
            <p><strong>Văn hóa:</strong> {companyInfo.companyCulture}</p>

            <Button variant="outline-success" onClick={() => setShowModal(true)}>
                Cập nhật thông tin công ty
            </Button>

            {/* Modal cập nhật */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật công ty</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Tên công ty</Form.Label>
                            <Form.Control name="companyName" value={form.companyName} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Loại hình</Form.Label>
                            <Form.Control name="companyType" value={form.companyType} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Ngành nghề</Form.Label>
                            <Form.Control name="industry" value={form.industry} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Quy mô công ty</Form.Label>
                            <Form.Control name="companySize" value={form.companySize} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Địa chỉ cụ thể</Form.Label>
                            <Form.Control name="companyLine" value={form.companyLine} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Thành phố</Form.Label>
                            <Form.Control name="companyCity" value={form.companyCity} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Quốc gia</Form.Label>
                            <Form.Control name="companyCountry" value={form.companyCountry} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Ngày làm việc</Form.Label>
                            <Form.Control name="companyWorkingTime" value={form.companyWorkingTime} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Làm ngoài giờ</Form.Label>
                            <Form.Control name="companyOvertime" value={form.companyOvertime} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Giới thiệu tổng quan</Form.Label>
                            <Form.Control as="textarea" rows={3} name="companyAbout" value={form.companyAbout} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Kỹ năng nổi bật</Form.Label>
                            <Form.Control
                                name="companySkills"
                                value={form.companySkills}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Chế độ đãi ngộ</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="companyPerks"
                                value={form.companyPerks}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Fanpage Facebook</Form.Label>
                            <Form.Control name="companyFanpage" value={form.companyFanpage} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Website công ty</Form.Label>
                            <Form.Control name="companyWebsite" value={form.companyWebsite} onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleSave}>Lưu</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CompanyProfile;