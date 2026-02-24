import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import CompanyService from '../../services/CompanyService';
import { AuthContext } from '../../contexts/AuthContext';
import RequireText from '../../components/RequireText.js';

const CompanyProfile = ({ companyInfo, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
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
                country: 'Việt Nam',
            },
            workingDays: form.companyWorkingTime,
            Overtime: form.companyOvertime,
            overview: form.companyAbout,
            keySkills: form.companySkills,
            perksContent: form.companyPerks,
            fanpageUrl: form.companyFanpage,
            websiteUrl: form.companyWebsite,
        };

        CompanyService.updateCompany(companyInfo.companyId, updatedData, user.accessToken)
            .then(() => {
                console.log('✅ Cập nhật công ty thành công');
                setShowModal(false);
                window.location.reload();
            })
            .catch((err) => console.error('❌ Lỗi cập nhật công ty:', err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!form.companyName.trim()) newErrors.companyName = "Tên công ty bắt buộc";
        if (!form.companyType.trim()) newErrors.companyType = "Loại hình bắt buộc";
        if (!form.industry.trim()) newErrors.industry = "Ngành nghề bắt buộc";
        if (!form.companyCity) newErrors.companyCity = "Chọn thành phố";
        if (!form.companyCountry) newErrors.companyCountry = "Chọn quốc gia";

        // Các trường khác tùy bạn thêm vào

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Gọi API nếu hợp lệ
        handleSave(); // hoặc submit trực tiếp
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
    ];

    if (!companyInfo) return null;

    return (
        <div className="card p-4">
           <h4 className="mb-4 fw-bold text-center" style={{ color: '#06923E' }}>🏢 Thông tin công ty</h4>

  {/* Thông tin cơ bản */}
  <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
  <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>
    📝 Thông tin cơ bản
  </h5>
  <p className="mb-2"><strong>Công ty:</strong> {companyInfo.companyName}</p>
  <p className="mb-2"><strong>Loại hình:</strong> {companyInfo.companyType}</p>
  <p className="mb-2"><strong>Ngành nghề:</strong> {companyInfo.industry}</p>
  <p className="mb-0"><strong>Slogan:</strong> “{companyInfo.slogan}”</p>
</div>

  {/* Thông tin liên hệ & mạng xã hội */}
  <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
    <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>📞 Thông tin liên hệ & Mạng xã hội</h5>
    <p><strong>Địa chỉ:</strong> {companyInfo.companyLine}, {companyInfo.companyCity}, {companyInfo.companyCountry}</p>
    <p><strong>Website:</strong> <a href={companyInfo.companyWebsite} target="_blank" rel="noopener noreferrer">{companyInfo.companyWebsite}</a></p>
    <p><strong>Fanpage:</strong> <a href={companyInfo.companyFanpage} target="_blank" rel="noopener noreferrer">{companyInfo.companyFanpage}</a></p>
  </div>

  {/* Thông tin làm việc */}
  <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
    <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>💼 Thông tin làm việc</h5>
    <p><strong>Quy mô nhân sự:</strong> {companyInfo.companySize}</p>
    <p><strong>Overtime:</strong> {companyInfo.companyOvertime}</p>
    <p><strong>Thời gian làm việc:</strong> {companyInfo.companyWorkingTime}</p>
    <p><strong>Kỹ năng:</strong></p>
    <div>
      {companyInfo.companySkills.map((skill, idx) => (
        <span key={idx} className="badge bg-success text-white me-2 mb-2">{skill}</span>
      ))}
    </div>
  </div>

  {/* Văn hoá & giới thiệu */}
  <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
    <h5 className="fw-bold border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>🎯 Văn hóa & Giới thiệu</h5>
    <p><strong>Văn hóa:</strong> {companyInfo.companyCulture}</p>
    <p><strong>Giới thiệu:</strong> {companyInfo.companyAbout}</p>
  </div>

  <div className="text-end">
    <Button variant="outline-success" onClick={() => setShowModal(true)}>
      Cập nhật thông tin công ty
    </Button>
  </div>

            {/* Modal cập nhật */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title style={{ color: '#06923E' }}>Cập nhật công ty</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form onSubmit={handleSubmit} noValidate>
      {/* Block 1: Thông tin cơ bản */}
      <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
        <h5 className="border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>📝 Thông tin cơ bản</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label><RequireText label="Công ty:" /></Form.Label>
            <Form.Control name="companyName" value={form.companyName} onChange={handleChange} isInvalid={!!errors.companyName} />
            <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label><RequireText label="Loại hình:" /></Form.Label>
            <Form.Control name="companyType" value={form.companyType} onChange={handleChange} isInvalid={!!errors.companyType} />
            <Form.Control.Feedback type="invalid">{errors.companyType}</Form.Control.Feedback>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Label>Lĩnh vực:</Form.Label>
                    <Form.Control name="foundedYear" value='Bảo hiểm' onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Form.Label>Ngành nghề:</Form.Label>
            <Form.Control name="industry" value={form.industry} onChange={handleChange} />
          </Col>
        </Row>
      </div>

      {/* Block 2: Thông tin liên hệ & social */}
      <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
        <h5 className="border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>🌐 Liên hệ & Social</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Địa chỉ cụ thể:</Form.Label>
            <Form.Control name="companyLine" value={form.companyLine} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Form.Label><RequireText label="Thành phố:" /></Form.Label>
            <Form.Select name="companyCity" value={form.companyCity} onChange={handleChange} required>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Label><RequireText label="Quốc gia:" /></Form.Label>
            <Form.Select name="companyCountry" value={form.companyCountry} onChange={handleChange} required>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={6}>
            <Form.Label>Fanpage Facebook:</Form.Label>
            <Form.Control name="companyFanpage" value={form.companyFanpage} onChange={handleChange} />
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label>Website công ty:</Form.Label>
            <Form.Control name="companyWebsite" value={form.companyWebsite} onChange={handleChange} />
          </Col>
        </Row>
      </div>

      {/* Block 3: Thông tin làm việc */}
      <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
        <h5 className="border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>💼 Thông tin làm việc</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Quy mô công ty:</Form.Label>
            <Form.Control name="companySize" value={form.companySize} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Form.Label>Thời gian làm việc:</Form.Label>
            <Form.Control name="companyWorkingTime" value={form.companyWorkingTime} onChange={handleChange} />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Label>Làm ngoài giờ:</Form.Label>
            <Form.Control name="companyOvertime" value={form.companyOvertime} onChange={handleChange} />
          </Col>
          <Col md={6}>
            <Form.Label>Kỹ năng nổi bật:</Form.Label>
            <Form.Control name="companySkills" value={form.companySkills} onChange={handleChange} />
          </Col>
        </Row>
      </div>

      {/* Block 4: Giới thiệu & văn hóa */}
      <div className="border border-secondary-subtle bg-light p-4 rounded mb-4 shadow-sm">
        <h5 className="border-bottom pb-2 mb-3" style={{ color: '#06923E' }}>🏢 Văn hóa & Giới thiệu</h5>
        <Row className="mb-3">
          <Col>
            <Form.Label>Giới thiệu tổng quan:</Form.Label>
            <Form.Control as="textarea" rows={3} name="companyAbout" value={form.companyAbout} onChange={handleChange} />
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label>Chế độ đãi ngộ:</Form.Label>
            <Form.Control as="textarea" rows={2} name="companyPerks" value={form.companyPerks} onChange={handleChange} />
          </Col>
        </Row>
      </div>

      {/* Footer buttons */}
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
        <Button type="submit" variant="outline-success">Lưu</Button>
      </Modal.Footer>
    </Form>
  </Modal.Body>
</Modal>

        </div>
    );
};

export default CompanyProfile;