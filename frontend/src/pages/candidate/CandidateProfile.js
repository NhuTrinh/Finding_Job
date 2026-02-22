// src/pages/candidate/CandidateProfile.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Container, Alert, Modal } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaGift, FaVenusMars, FaMapMarkerAlt, FaGlobe, FaPen } from "react-icons/fa";

import CandidateService from "../../services/CandidateService";

const CandidateProfile = () => {
    const navigate = useNavigate();

    const [candidateProfile, setCandidateProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal edit
    const [showEdit, setShowEdit] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form edit (minimal but useful)
    const [form, setForm] = useState({
        fullName: "",
        jobTitle: "",
        phoneNumber: "",
        birthDay: "",
        gender: "",
        link: "",
        aboutMe: "",
        address: { line: "", city: "", country: "" },
    });

    const token = localStorage.getItem("accessToken");

    const fillFormFromProfile = (p) => {
        setForm({
            fullName: p?.fullName || "",
            jobTitle: p?.jobTitle || "",
            phoneNumber: p?.phoneNumber || "",
            birthDay: p?.birthDay || "",
            gender: p?.gender || "",
            link: p?.link || "",
            aboutMe: p?.aboutMe || "",
            address: p?.address || { line: "", city: "", country: "" },
        });
    };

    const fetchMe = async () => {
        try {
            if (!token) {
                navigate("/candidate/login");
                return;
            }

            setLoading(true);
            const res = await CandidateService.getProfile();

            // backend trả { status, data }
            const me = res?.data?.data;
            if (!me) {
                setCandidateProfile(null);
                return;
            }

            setCandidateProfile(me);
            fillFormFromProfile(me);
        } catch (error) {
            console.error("Lỗi khi lấy profile:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();

    }, []);

    // ===== Derived values =====
    const firstLetter = (candidateProfile?.fullName || "U").charAt(0).toUpperCase();

    // backend profile hiện là skills: [] (array string)
    const skills = Array.isArray(candidateProfile?.skills) ? candidateProfile.skills : [];

    const handleOpenEdit = () => setShowEdit(true);
    const handleCloseEdit = () => {
        setShowEdit(false);
        // reset lại form theo profile hiện tại (tránh edit dở)
        if (candidateProfile) fillFormFromProfile(candidateProfile);
    };

    const handleSave = async () => {
        try {
            if (!token) {
                navigate("/candidate/login");
                return;
            }

            setSaving(true);

            // payload theo schema CandidateProfileUpdate backend
            const payload = {
                fullName: form.fullName,
                jobTitle: form.jobTitle,
                phoneNumber: form.phoneNumber,
                birthDay: form.birthDay,
                gender: form.gender,
                link: form.link,
                aboutMe: form.aboutMe,
                address: form.address,
            };

            const res = await CandidateService.updateProfile(payload);
            const updated = res?.data?.data;

            if (updated) {
                setCandidateProfile(updated);
                // cập nhật fullName để HeaderCandidate hiển thị đúng
                if (updated.fullName) localStorage.setItem("fullName", updated.fullName);
            }

            setShowEdit(false);
        } catch (error) {
            console.error("Lỗi khi cập nhật profile:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="container my-5">Loading profile...</p>;

    if (!candidateProfile) {
        return (
            <div className="container my-5">
                <p>Không có dữ liệu ứng viên.</p>
                <Button variant="primary" onClick={() => navigate("/candidate/login")}>
                    Đăng nhập
                </Button>
            </div>
        );
    }

    return (
        <Container className="my-4">
            <Button
                variant="link"
                className="mb-3 ps-0 text-success fw-bold"
                onClick={() => navigate("/")}
            >
                ← Trở về Trang chủ
            </Button>

            <Card className="p-4 shadow-lg rounded-4">
                {/* ===== Thông tin cơ bản ===== */}
                <Card className="p-3 shadow-sm">
                    <Row>
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            <div
                                className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                                style={{ width: "70px", height: "70px", fontSize: "30px" }}
                            >
                                {firstLetter}
                            </div>
                        </Col>

                        <Col md={10}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-1 fw-bold">{candidateProfile.fullName}</h4>
                                    <div className="text-muted">{candidateProfile.jobTitle || "Chưa cập nhật chức danh"}</div>
                                </div>

                                <FaPen
                                    className="text-muted cursor-pointer"
                                    title="Chỉnh sửa"
                                    style={{ cursor: "pointer" }}
                                    onClick={handleOpenEdit}
                                />
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
                                        ? new Date(candidateProfile.birthDay).toLocaleDateString()
                                        : "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaVenusMars className="me-2" />
                                    {candidateProfile.gender || "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaMapMarkerAlt className="me-2" />
                                    {candidateProfile.address
                                        ? `${candidateProfile.address.line || ""}${candidateProfile.address.city ? `, ${candidateProfile.address.city}` : ""}`
                                        : "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaGlobe className="me-2" />
                                    {candidateProfile.link || "Chưa cập nhật"}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Alert variant="info" className="mt-4 mb-0 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Email trong hồ sơ</strong> được đồng bộ với email tài khoản và không thể thay đổi.
                        </div>
                        <span style={{ cursor: "default" }}>&times;</span>
                    </Alert>
                </Card>

                {/* ===== Giới thiệu ===== */}
                <Card className="p-3 shadow-sm mt-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">Giới thiệu bản thân</h5>
                        <FaPen
                            className="text-muted"
                            title="Chỉnh sửa"
                            style={{ cursor: "pointer" }}
                            onClick={handleOpenEdit}
                        />
                    </div>
                    <hr />
                    <div style={{ whiteSpace: "pre-line", lineHeight: "1.7" }}>
                        <p className="mb-0">{candidateProfile.aboutMe || "Không có mô tả."}</p>
                    </div>
                </Card>

                {/* ===== Học vấn ===== */}
                <Card className="mb-4 shadow-sm border-0 mt-4">
                    <Card.Body>
                        <Card.Title className="mb-3 text-success">🎓 Học vấn</Card.Title>

                        {candidateProfile?.education?.length > 0 ? (
                            candidateProfile.education.map((edu, index) => (
                                <Card key={index} className="mb-3 border shadow-sm">
                                    <Card.Body>
                                        <h6 className="mb-1 text-primary">{edu.schoolName}</h6>
                                        <p className="mb-1"><strong>Ngành:</strong> {edu.major}</p>
                                        <p className="mb-0">
                                            <strong>Thời gian:</strong>{" "}
                                            {edu.startDate ? new Date(edu.startDate).toLocaleDateString() : "-"} -{" "}
                                            {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "-"}
                                        </p>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted">Chưa cập nhật học vấn.</p>
                        )}
                    </Card.Body>
                </Card>

                {/* ===== Kỹ năng ===== */}
                <Row className="mt-2">
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Kỹ năng</h5>
                            <div className="mt-1">
                                {skills.length ? (
                                    skills.map((skill, idx) => (
                                        <span key={idx} className="badge bg-success me-2 mb-2">{skill}</span>
                                    ))
                                ) : (
                                    <span className="text-muted">Chưa cập nhật</span>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* ===== Ngôn ngữ ===== */}
                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Ngôn ngữ</h5>

                            {candidateProfile?.languages?.length > 0 ? (
                                <ul className="ps-3 mb-0">
                                    {candidateProfile.languages.map((lang, index) => (
                                        <li key={index}>
                                            {lang.language} - {lang.level}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">Chưa cập nhật ngôn ngữ.</p>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* ===== Kinh nghiệm ===== */}
                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Kinh nghiệm làm việc</h5>
                            {candidateProfile?.workExperience?.length > 0 ? (
                                candidateProfile.workExperience.map((exp, index) => (
                                    <div key={index} className="border rounded p-3 mb-3 shadow-sm">
                                        <h6 className="mb-1 text-primary">{exp.jobTitle}</h6>
                                        <p className="mb-1"><strong>Công ty:</strong> {exp.companyName}</p>
                                        <p className="mb-1">
                                            <strong>Thời gian:</strong>{" "}
                                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : "-"} -{" "}
                                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "-"}
                                        </p>
                                        {exp.project && <p className="mb-1"><strong>Dự án:</strong> {exp.project}</p>}
                                        {exp.description && <p className="mb-0"><strong>Mô tả:</strong> {exp.description}</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">Chưa có kinh nghiệm làm việc.</p>
                            )}
                        </div>
                    </Col>
                </Row>

                {/* ===== Dự án/Chứng chỉ/Giải thưởng giữ nguyên như bạn đã có ===== */}
            </Card>

            {/* ===== Modal Edit Profile ===== */}
            <Modal show={showEdit} onHide={handleCloseEdit} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật hồ sơ</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Họ tên</label>
                        <input
                            className="form-control"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Chức danh</label>
                        <input
                            className="form-control"
                            value={form.jobTitle}
                            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Số điện thoại</label>
                        <input
                            className="form-control"
                            value={form.phoneNumber}
                            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        />
                    </div>

                    <Row>
                        <Col md={6} className="mb-3">
                            <label className="form-label">Địa chỉ</label>
                            <input
                                className="form-control"
                                value={form.address.line}
                                onChange={(e) => setForm({ ...form, address: { ...form.address, line: e.target.value } })}
                            />
                        </Col>
                        <Col md={6} className="mb-3">
                            <label className="form-label">Thành phố</label>
                            <input
                                className="form-control"
                                value={form.address.city}
                                onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                            />
                        </Col>
                    </Row>

                    <div className="mb-3">
                        <label className="form-label">Link</label>
                        <input
                            className="form-control"
                            value={form.link}
                            onChange={(e) => setForm({ ...form, link: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Giới thiệu</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={form.aboutMe}
                            onChange={(e) => setForm({ ...form, aboutMe: e.target.value })}
                        />
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit} disabled={saving}>
                        Huỷ
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CandidateProfile;