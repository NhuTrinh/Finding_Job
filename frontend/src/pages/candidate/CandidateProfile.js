import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Dropdown, Modal } from 'react-bootstrap';
import avatar from '../../assets/img/avatar.png';
import { AuthContext } from '../../contexts/AuthContext';
import CandidateService from '../../services/CandidateService';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import { Alert } from "react-bootstrap";
import api from "../../api";
import { FaEnvelope, FaPhone, FaGift, FaVenusMars, FaMapMarkerAlt, FaGlobe, FaPen } from "react-icons/fa";


const CandidateProfile = () => {
    const navigate = useNavigate();
    const [candidateProfile, setcandidateProfile] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            
            try {
                const res = await api.get('candidates/profile-cv'); // gọi API lấy job theo ID
                console.log("Profile: ", res.data);
                setcandidateProfile(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết profile:", error);
            }
        };

        fetchUser();
    }, []);

    if (!candidateProfile) {
        return <p>Không có dữ liệu ứng viên.</p>;
    }


    const skills = candidateProfile?.skills?.[0] || { coreSkills: [], softSkills: [] };

    console.log("coreSkill: ", skills.coreSkills);
    console.log("softSkills: ", skills.softSkills);

    const firstLetter = candidateProfile?.fullName.charAt(0).toUpperCase();

    const handleEdit = () => {
    navigate('/candidate/edit/profile');
  };

    return (
        <Container>
            <Button
                variant="link"
                className="mb-3 ps-0 text-success fw-bold"
                onClick={() => navigate('/')}
            >
                ← Trở về Trang chủ
            </Button>

            <Card className="p-4 shadow-lg rounded-4">
                {/* Row 1: Thông tin ứng viên + Sidebar */}
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
                                    <h4 className="mb-1 fw-bold">{candidateProfile?.fullName}</h4>
                                    <div className="text-muted">Cập nhật chức danh</div>
                                </div>
                                <FaPen className="text-muted cursor-pointer" title="Chỉnh sửa" onClick={handleEdit}/>
                            </div>

                            <Row className="mt-3">
                                <Col md={6} className="mb-2">
                                    <FaEnvelope className="me-2" />
                                    {candidateProfile?.email || "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaPhone className="me-2" />
                                    {candidateProfile?.phoneNumber || "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaGift className="me-2" />
                                    {candidateProfile?.birthDay
                                        ? new Date(candidateProfile.birthDay).toLocaleDateString()
                                        : "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaVenusMars className="me-2" />
                                    {candidateProfile?.gender || "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaMapMarkerAlt className="me-2" />
                                    {candidateProfile?.address
                                        ? `${candidateProfile.address.line || ""}, ${candidateProfile.address.city || ""}`
                                        : "Chưa cập nhật"}
                                </Col>
                                <Col md={6} className="mb-2">
                                    <FaGlobe className="me-2" />
                                    {candidateProfile?.link || "Chưa cập nhật"}
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    <Alert variant="info" className="mt-4 mb-0 d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Email trong hồ sơ</strong> của bạn hiện đã được đồng bộ với email tài khoản và không thể thay đổi.
                        </div>
                        <span className="cursor-pointer">&times;</span>
                    </Alert>
                </Card>

                <Card className="p-3 shadow-sm mt-4">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="fw-bold mb-0">Giới thiệu bản thân</h5>
                        <FaPen className="text-muted cursor-pointer" title="Chỉnh sửa" />
                    </div>
                    <hr />
                    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
                        <ul className="ps-3 mb-0">
                            <p>{candidateProfile?.aboutMe || 'Không có mô tả.'}</p>
                        </ul>
                    </div>

                </Card>
                {/* Row 5: Học vấn */}
                <Card className="mb-4 shadow-sm border-0">
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
                                            {new Date(edu.startDate).toLocaleDateString()} -{" "}
                                            {new Date(edu.endDate).toLocaleDateString()}
                                        </p>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className="text-muted">Chưa cập nhật học vấn.</p>
                        )}
                    </Card.Body>
                </Card>





                {/* Row 3: Kỹ năng */}
                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Kỹ năng</h5>

                            <div className="mb-2">
                                <strong>Chuyên môn:</strong>
                                <div className="mt-1">
                                    {skills.coreSkills.length ? skills.coreSkills.map((skill, idx) => (
                                        <span key={idx} className="badge bg-success me-2">{skill}</span>
                                    )) : <span className="text-muted">Chưa cập nhật</span>}
                                </div>
                            </div>

                            <div>
                                <strong>Mềm:</strong>
                                <div className="mt-1">
                                    {skills.softSkills.length ? skills.softSkills.map((skill, idx) => (
                                        <span key={idx} className="badge bg-info text-dark me-2">{skill}</span>
                                    )) : <span className="text-muted">Chưa cập nhật</span>}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Ngôn ngữ</h5>

                            {candidateProfile?.foreignLanguages?.length > 0 ? (
                                <ul className="ps-3 mb-0">
                                    {candidateProfile.foreignLanguages.map((lang, index) => (
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

                {/* Row 4: Kinh nghiệm làm việc */}
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
                                            <strong>Thời gian:</strong> {new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}
                                        </p>
                                        {exp.project && (
                                            <p className="mb-1"><strong>Dự án:</strong> {exp.project}</p>
                                        )}
                                        {exp.description && (
                                            <p className="mb-0"><strong>Mô tả:</strong> {exp.description}</p>
                                        )}
                                    </div>
                                ))
                            ) : <p>Chưa có kinh nghiệm làm việc.</p>}
                        </div>
                    </Col>
                </Row>



                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Dự án tiêu biểu</h5>
                            {candidateProfile?.highlightProjects?.length > 0 ? (
                                <ul className="ps-3 mb-0">
                                    {candidateProfile.highlightProjects.map((proj, index) => (
                                        <li key={index}>
                                            <strong>{proj.name}</strong> ({new Date(proj.startDate).getFullYear()} - {new Date(proj.endDate).getFullYear()})<br />
                                            {proj.description}<br />
                                            {proj.projectUrl && (
                                                <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer">
                                                    {proj.projectUrl}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">Chưa cập nhật dự án.</p>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Chứng chỉ</h5>
                            {candidateProfile?.certificates?.length > 0 ? (
                                <ul className="ps-3 mb-0">
                                    {candidateProfile.certificates.map((cert, index) => (
                                        <li key={index}>
                                            <strong>{cert.name}</strong> - {cert.organization} ({new Date(cert.issueDate).toLocaleDateString('vi-VN')})<br />
                                            {cert.description}<br />
                                            {cert.certificateUrl && (
                                                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                                                    {cert.certificateUrl}
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">Chưa cập nhật chứng chỉ.</p>
                            )}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div className="mb-4 border-bottom pb-3">
                            <h5 className="mb-2 text-success">Giải thưởng</h5>
                            {candidateProfile?.awards?.length > 0 ? (
                                <ul className="ps-3 mb-0">
                                    {candidateProfile.awards.map((award, index) => (
                                        <li key={index}>
                                            <strong>{award.name}</strong> - {award.organization} ({new Date(award.issueDate).toLocaleDateString('vi-VN')})<br />
                                            {award.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">Chưa cập nhật giải thưởng.</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default CandidateProfile;