import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Dropdown, Modal, Form } from 'react-bootstrap';
import avatar from '../../assets/img/avatar.png';
import { AuthContext } from '../../contexts/AuthContext';
import CandidateService from '../../services/CandidateService';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { Alert } from "react-bootstrap";
import RecruiterService from '../../services/RecruiterService';
import { FaEnvelope, FaPhone, FaGift, FaVenusMars, FaMapMarkerAlt, FaGlobe, FaPen } from "react-icons/fa";

const EmployerProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [employerProfile, setemployerProfile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ fullName: "" });
    const [originalForm, setOriginalForm] = useState({ fullName: "" });

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/employer/login';
    };

    useEffect(() => {
        if (!user?.accessToken) return;

        RecruiterService.getProfile(user.accessToken)
            .then((response) => {
                const raw = response.data;
                const recruiterData = {
                    fullName: raw.fullName,
                    email: raw.email,
                    companyId: raw.recruiter?.companyId,
                    position: raw.recruiter?.position,
                    recruiterId: raw.recruiter?._id,
                };
                console.log("✅ recruiterData from API:", recruiterData);
                setemployerProfile(recruiterData);
                console.log("🟢 Đang ở trang EmployerProfile");
            })
            .catch((error) => {
                console.error("❌ Lỗi khi gọi API RecruiterService.getProfile:", error);
            });
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // Gửi API cập nhật thông tin tại đây nếu muốn
        setemployerProfile((prev) => ({ ...prev, fullName: form.fullName }));
        setShowModal(false);
    };

    const firstLetter = employerProfile?.fullName?.charAt(0)?.toUpperCase() || '';

    if (!employerProfile) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-success" role="status" />
                <div className="mt-2">Đang tải hồ sơ nhà tuyển dụng...</div>
            </Container>
        );
    }

    return (
        <Container>
            <Button
                variant="link"
                className="mb-3 ps-0 text-success fw-bold"
                onClick={() => navigate('/employer/dashboard')}
            >
                ← Trở về Trang chủ
            </Button>

            <Card className="p-4 shadow-lg rounded-4">
                {/* Row 1: Thông tin */}
                <Card className="p-3 shadow-sm">
                    <Row>
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            <div
                                className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
                                style={{ width: "70px", height: "70px", fontSize: "30px" }}
                            >
                                {employerProfile?.fullName ? employerProfile.fullName.charAt(0).toUpperCase() : ""}
                            </div>
                        </Col>

                        <Col md={10}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h4 className="mb-1 fw-bold">{employerProfile?.fullName || "Chưa cập nhật"}</h4>
                                    <div className="text-muted">Cập nhật chức danh</div>
                                </div>
                                <FaPen className="text-muted cursor-pointer" title="Chỉnh sửa" onClick={() => setShowModal(true)}/>
                            </div>

                            <Row className="mt-3">
                                <Col md={6} className="mb-2">
                                    <FaEnvelope className="me-2" />
                                    {employerProfile?.email || "Chưa cập nhật"}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>
            </Card>
            {/* Modal chỉnh sửa thông tin */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: '#06923E' }}>Cập nhật thông tin</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Họ tên</Form.Label>
                            <Form.Control
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                name="fullName"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setForm({ ...originalForm }); // Khôi phục dữ liệu
                        setShowModal(false);         // Đóng modal
                    }}>
                        Hủy
                    </Button>
                    <Button variant="outline-success" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EmployerProfile;