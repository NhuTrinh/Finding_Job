import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CandidateService from "../../services/CandidateService";
import {
  FaEnvelope,
  FaPhone,
  FaGift,
  FaVenusMars,
  FaMapMarkerAlt,
  FaGlobe,
  FaPen,
} from "react-icons/fa";

const CandidateProfile = () => {
  const navigate = useNavigate();

  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form edit nhẹ cho demo
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    birthDay: "",
    jobTitle: "",
    link: "",
    aboutMe: "",
    address: {
      line: "",
      city: "",
      country: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await CandidateService.getProfile();

      // hỗ trợ cả wrapper/non-wrapper
      const profile = res.data?.data ?? res.data;
      setCandidateProfile(profile);

      setForm({
        fullName: profile?.fullName || "",
        phoneNumber: profile?.phoneNumber || "",
        birthDay: profile?.birthDay || "",
        jobTitle: profile?.jobTitle || "",
        link: profile?.link || "",
        aboutMe: profile?.aboutMe || "",
        address: {
          line: profile?.address?.line || "",
          city: profile?.address?.city || "",
          country: profile?.address?.country || "",
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy hồ sơ ứng viên:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // chỉ gửi các field cần update
      const payload = {
        fullName: form.fullName,
        phoneNumber: form.phoneNumber,
        birthDay: form.birthDay,
        jobTitle: form.jobTitle,
        link: form.link,
        aboutMe: form.aboutMe,
        address: {
          line: form.address.line,
          city: form.address.city,
          country: form.address.country,
        },
      };

      const res = await CandidateService.updateProfile(payload);
      const updated = res.data?.data ?? res.data;

      setCandidateProfile(updated);
      setEditMode(false);

      // đồng bộ tên trên header
      if (updated?.fullName) {
        localStorage.setItem("fullName", updated.fullName);
      }

      alert("Lưu hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      alert(error?.response?.data?.detail || "Lưu hồ sơ thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Đang tải hồ sơ...</p>;
  if (!candidateProfile) return <p className="text-center mt-4">Không có dữ liệu ứng viên.</p>;

  // hỗ trợ schema mới + cũ
  const skillsNew = Array.isArray(candidateProfile.skills) ? candidateProfile.skills : [];
  const skillsLegacy = candidateProfile?.skills?.[0] || { coreSkills: [], softSkills: [] };

  const coreSkills =
    Array.isArray(skillsLegacy.coreSkills) && skillsLegacy.coreSkills.length > 0
      ? skillsLegacy.coreSkills
      : skillsNew;

  const softSkills = Array.isArray(skillsLegacy.softSkills) ? skillsLegacy.softSkills : [];

  const languages =
    candidateProfile.languages?.length > 0
      ? candidateProfile.languages
      : candidateProfile.foreignLanguages || [];

  const projects =
    candidateProfile.projects?.length > 0
      ? candidateProfile.projects
      : candidateProfile.highlightProjects || [];

  const awards = candidateProfile.awards || []; // backend mới có thể chưa có

  const firstLetter = (candidateProfile?.fullName || "?").charAt(0).toUpperCase();

  return (
    <Container className="my-4">
      <Button
        variant="link"
        className="mb-3 ps-0 text-success fw-bold"
        onClick={() => navigate("/")}
      >
        ← Trở về Trang chủ
      </Button>

      <Card className="p-4 shadow-lg rounded-4 border-0">
        {/* Thông tin chính */}
        <Card className="p-3 shadow-sm border-0">
          <Row>
            <Col md={2} className="d-flex justify-content-center align-items-center mb-3 mb-md-0">
              <div
                className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                style={{ width: "70px", height: "70px", fontSize: "30px", fontWeight: "bold" }}
              >
                {firstLetter}
              </div>
            </Col>

            <Col md={10}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h4 className="mb-1 fw-bold">{candidateProfile.fullName || "Chưa cập nhật"}</h4>
                  <div className="text-muted">
                    {candidateProfile.jobTitle || "Chưa cập nhật chức danh"}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleEditToggle}
                >
                  <FaPen className="me-1" />
                  {editMode ? "Đóng chỉnh sửa" : "Chỉnh sửa"}
                </button>
              </div>

              <Row className="mt-3">
                <Col md={6} className="mb-2">
                  <FaEnvelope className="me-2" />
                  {candidateProfile.email || "Chưa cập nhật"}
                </Col>
                <Col md={6} className="mb-2">
                  <FaPhone className="me-2" />
                  {candidateProfile.phoneNumber || "Chưa cập nhật"}
                </Col>
                <Col md={6} className="mb-2">
                  <FaGift className="me-2" />
                  {candidateProfile.birthDay
                    ? new Date(candidateProfile.birthDay).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </Col>
                <Col md={6} className="mb-2">
                  <FaVenusMars className="me-2" />
                  {candidateProfile.gender || "Chưa cập nhật"}
                </Col>
                <Col md={6} className="mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  {candidateProfile.address
                    ? `${candidateProfile.address.line || ""}${candidateProfile.address.line && candidateProfile.address.city ? ", " : ""}${candidateProfile.address.city || ""}${candidateProfile.address.country ? `, ${candidateProfile.address.country}` : ""}` ||
                      "Chưa cập nhật"
                    : "Chưa cập nhật"}
                </Col>
                <Col md={6} className="mb-2">
                  <FaGlobe className="me-2" />
                  {candidateProfile.link || "Chưa cập nhật"}
                </Col>
              </Row>
            </Col>
          </Row>

          <Alert variant="info" className="mt-4 mb-0">
            <strong>Email trong hồ sơ</strong> được đồng bộ với tài khoản và không thể thay đổi.
          </Alert>
        </Card>

        {/* Khối chỉnh sửa nhanh */}
        {editMode && (
          <Card className="p-3 shadow-sm mt-4 border-0">
            <h5 className="fw-bold mb-3">Chỉnh sửa hồ sơ của tôi</h5>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chức danh</Form.Label>
                  <Form.Control
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="Ví dụ: Frontend Developer"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDay"
                    value={form.birthDay}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Link cá nhân</Form.Label>
                  <Form.Control
                    name="link"
                    value={form.link}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    name="address.line"
                    value={form.address.line}
                    onChange={handleChange}
                    placeholder="Số nhà, đường..."
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Thành phố</Form.Label>
                  <Form.Control
                    name="address.city"
                    value={form.address.city}
                    onChange={handleChange}
                    placeholder="TP.HCM"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Quốc gia</Form.Label>
                  <Form.Control
                    name="address.country"
                    value={form.address.country}
                    onChange={handleChange}
                    placeholder="Vietnam"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Giới thiệu bản thân</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="aboutMe"
                    value={form.aboutMe}
                    onChange={handleChange}
                    placeholder="Viết vài dòng giới thiệu..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              <Button variant="outline-secondary" onClick={handleEditToggle} disabled={saving}>
                Hủy
              </Button>
            </div>
          </Card>
        )}

        {/* Giới thiệu */}
        <Card className="p-3 shadow-sm mt-4 border-0">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="fw-bold mb-0">Giới thiệu bản thân</h5>
          </div>
          <hr />
          <p className="mb-0" style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
            {candidateProfile.aboutMe || "Không có mô tả."}
          </p>
        </Card>

        {/* Học vấn */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <Card.Title className="mb-3 text-success">🎓 Học vấn</Card.Title>
            {candidateProfile.education?.length > 0 ? (
              candidateProfile.education.map((edu, index) => (
                <Card key={index} className="mb-3 border shadow-sm">
                  <Card.Body>
                    <h6 className="mb-1 text-primary">
                      {edu.schoolName || edu.school || "Chưa có tên trường"}
                    </h6>
                    <p className="mb-1"><strong>Ngành:</strong> {edu.major || "Chưa cập nhật"}</p>
                    <p className="mb-0">
                      <strong>Thời gian:</strong>{" "}
                      {edu.startDate ? new Date(edu.startDate).toLocaleDateString("vi-VN") : "?"}
                      {" - "}
                      {edu.endDate ? new Date(edu.endDate).toLocaleDateString("vi-VN") : "?"}
                    </p>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <p className="text-muted mb-0">Chưa cập nhật học vấn.</p>
            )}
          </Card.Body>
        </Card>

        {/* Kỹ năng */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="mb-3 text-success">🛠️ Kỹ năng</h5>

            <div className="mb-3">
              <strong>Chuyên môn:</strong>
              <div className="mt-2 d-flex flex-wrap gap-2">
                {coreSkills.length > 0 ? (
                  coreSkills.map((skill, idx) => (
                    <span key={idx} className="badge bg-success">{skill}</span>
                  ))
                ) : (
                  <span className="text-muted">Chưa cập nhật</span>
                )}
              </div>
            </div>

            <div>
              <strong>Kỹ năng mềm:</strong>
              <div className="mt-2 d-flex flex-wrap gap-2">
                {softSkills.length > 0 ? (
                  softSkills.map((skill, idx) => (
                    <span key={idx} className="badge bg-info text-dark">{skill}</span>
                  ))
                ) : (
                  <span className="text-muted">Chưa cập nhật</span>
                )}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Ngôn ngữ */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="mb-3 text-success">🌐 Ngôn ngữ</h5>
            {languages.length > 0 ? (
              <ul className="ps-3 mb-0">
                {languages.map((lang, index) => (
                  <li key={index}>
                    {typeof lang === "string"
                      ? lang
                      : `${lang.language || "Ngôn ngữ"}${lang.level ? ` - ${lang.level}` : ""}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">Chưa cập nhật ngôn ngữ.</p>
            )}
          </Card.Body>
        </Card>

        {/* Kinh nghiệm */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="mb-3 text-success">💼 Kinh nghiệm làm việc</h5>
            {candidateProfile.workExperience?.length > 0 ? (
              candidateProfile.workExperience.map((exp, index) => (
                <div key={index} className="border rounded p-3 mb-3 shadow-sm">
                  <h6 className="mb-1 text-primary">{exp.jobTitle || "Chưa cập nhật chức danh"}</h6>
                  <p className="mb-1"><strong>Công ty:</strong> {exp.companyName || "Chưa cập nhật"}</p>
                  <p className="mb-1">
                    <strong>Thời gian:</strong>{" "}
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString("vi-VN") : "?"}
                    {" - "}
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString("vi-VN") : "Hiện tại"}
                  </p>
                  {exp.project && <p className="mb-1"><strong>Dự án:</strong> {exp.project}</p>}
                  {exp.description && <p className="mb-0"><strong>Mô tả:</strong> {exp.description}</p>}
                </div>
              ))
            ) : (
              <p className="text-muted mb-0">Chưa có kinh nghiệm làm việc.</p>
            )}
          </Card.Body>
        </Card>

        {/* Dự án */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="mb-3 text-success">🚀 Dự án tiêu biểu</h5>
            {projects.length > 0 ? (
              <ul className="ps-3 mb-0">
                {projects.map((proj, index) => (
                  <li key={index} className="mb-2">
                    <strong>{proj.name || proj.projectName || "Dự án"}</strong>
                    {proj.description && <div>{proj.description}</div>}
                    {proj.projectUrl && (
                      <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer">
                        {proj.projectUrl}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">Chưa cập nhật dự án.</p>
            )}
          </Card.Body>
        </Card>

        {/* Chứng chỉ */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="mb-3 text-success">📜 Chứng chỉ</h5>
            {candidateProfile.certificates?.length > 0 ? (
              <ul className="ps-3 mb-0">
                {candidateProfile.certificates.map((cert, index) => (
                  <li key={index} className="mb-2">
                    <strong>{cert.name || "Chứng chỉ"}</strong>
                    {cert.organization ? ` - ${cert.organization}` : ""}
                    {cert.issueDate
                      ? ` (${new Date(cert.issueDate).toLocaleDateString("vi-VN")})`
                      : ""}
                    {cert.description && <div>{cert.description}</div>}
                    {cert.certificateUrl && (
                      <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                        {cert.certificateUrl}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">Chưa cập nhật chứng chỉ.</p>
            )}
          </Card.Body>
        </Card>

        {/* Giải thưởng (schema cũ có thể có) */}
        <Card className="mt-4 shadow-sm border-0">
          <Card.Body>
            <h5 className="mb-3 text-success">🏆 Giải thưởng</h5>
            {awards.length > 0 ? (
              <ul className="ps-3 mb-0">
                {awards.map((award, index) => (
                  <li key={index}>
                    <strong>{award.name}</strong>
                    {award.organization ? ` - ${award.organization}` : ""}
                    {award.issueDate
                      ? ` (${new Date(award.issueDate).toLocaleDateString("vi-VN")})`
                      : ""}
                    {award.description && <div>{award.description}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-0">Chưa cập nhật giải thưởng.</p>
            )}
          </Card.Body>
        </Card>
      </Card>
    </Container>
  );
};

export default CandidateProfile;