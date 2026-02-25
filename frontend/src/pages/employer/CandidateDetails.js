import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import defaultAvatar from "../../assets/img/avatar.png"

const CandidateDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    console.log("defaultAvatar:", defaultAvatar);

    useEffect(() => {
        const stateCandidate = location.state?.candidate;

        if (stateCandidate) {
            setCandidate(stateCandidate);
            localStorage.setItem("candidateData", JSON.stringify(stateCandidate));
        } else {
            const storedCandidate = localStorage.getItem("candidateData");
            if (storedCandidate) {
                setCandidate(JSON.parse(storedCandidate));
            }
        }
    }, [location.state]);

    if (!candidate) {
        return <p>Không có dữ liệu ứng viên.</p>;
    }

    // ===== DESTRUCTURE THEO RESPONSE MỚI =====
    const {
        accountId,
        fullName,
        email,
        avatar,
        jobTitle,
        phoneNumber,
        birthDay,
        address,
        link,
        aboutMe,
        skills = { coreSkills: [], softSkills: [] },
        education = [],
        workExperience = [],
        foreignLanguages = [],
        highlightProjects = [],
        certificates = [],
        awards = []
    } = candidate;

    const coreSkills = skills?.coreSkills || [];
    const softSkills = skills?.softSkills || [];

    return (
        <Container className="py-4">
            <Button
                variant="link"
                className="mb-3 ps-0 text-success fw-bold"
                onClick={() => navigate("/employer/dashboard")}
            >
                ← Trở về Trang chủ
            </Button>

            <Card className="p-4 shadow-lg rounded-4">
                {/* ===== THÔNG TIN CƠ BẢN ===== */}
                <Row>
                    <Col md={8}>
                        <div className="p-3 border rounded bg-white">
                            <h2 className="text-success mb-3">{fullName}</h2>
                            <p><strong>Email:</strong> {email}</p>
                            <p><strong>Điện thoại:</strong> {phoneNumber || "Chưa cập nhật"}</p>
                            <p><strong>Ngày sinh:</strong> {birthDay ? new Date(birthDay).toLocaleDateString() : "Chưa cập nhật"}</p>
                            <p><strong>LinkedIn:</strong> {link || "Chưa cập nhật"}</p>
                            <p>
                                <strong>Địa chỉ:</strong>{" "}
                                {address
                                    ? `${address.line || ""} ${address.city || ""} ${address.country || ""}`
                                    : "Chưa cập nhật"}
                            </p>
                            <p><strong>Vị trí mong muốn:</strong> {jobTitle || "Chưa cập nhật"}</p>
                        </div>
                    </Col>

                    <Col md={4}>
                        <Card className="p-3 text-center bg-light shadow-sm">
                            <Card.Img
                                src={defaultAvatar}
                                className="rounded mb-3"
                                onError={(e) => {
                                    e.target.src = defaultAvatar;
                                }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* ===== GIỚI THIỆU ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Giới thiệu bản thân</h5>
                        <p>{aboutMe || "Chưa có mô tả."}</p>
                    </Col>
                </Row>

                {/* ===== KỸ NĂNG ===== */}
                <Row className="mt-3">
                    <Col>
                        <h5 className="text-success">Kỹ năng</h5>

                        <div className="mb-2">
                            <strong>Chuyên môn:</strong>
                            <div className="mt-1">
                                {coreSkills.length > 0 ? (
                                    coreSkills.map((s, i) => (
                                        <span key={i} className="badge bg-success me-2">{s}</span>
                                    ))
                                ) : (
                                    <span className="text-muted">Chưa cập nhật</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <strong>Mềm:</strong>
                            <div className="mt-1">
                                {softSkills.length > 0 ? (
                                    softSkills.map((s, i) => (
                                        <span key={i} className="badge bg-info text-dark me-2">{s}</span>
                                    ))
                                ) : (
                                    <span className="text-muted">Chưa cập nhật</span>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* ===== NGÔN NGỮ ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Ngôn ngữ</h5>
                        {foreignLanguages.length > 0 ? (
                            <ul>
                                {foreignLanguages.map((lang, i) => (
                                    <li key={i}>{lang.language} - {lang.level}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Chưa cập nhật ngôn ngữ.</p>
                        )}
                    </Col>
                </Row>

                {/* ===== KINH NGHIỆM ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Kinh nghiệm làm việc</h5>
                        {workExperience.length > 0 ? (
                            workExperience.map((exp, i) => (
                                <div key={i} className="border rounded p-3 mb-3">
                                    <strong>{exp.jobTitle}</strong> – {exp.companyName}<br />
                                    {exp.startDate && exp.endDate && (
                                        <span>
                                            {new Date(exp.startDate).toLocaleDateString()} -{" "}
                                            {new Date(exp.endDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">Chưa có kinh nghiệm.</p>
                        )}
                    </Col>
                </Row>

                {/* ===== HỌC VẤN ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Học vấn</h5>
                        {education.length > 0 ? (
                            education.map((edu, i) => (
                                <div key={i} className="border rounded p-3 mb-3">
                                    <strong>{edu.schoolName}</strong> – {edu.major}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">Chưa cập nhật học vấn.</p>
                        )}
                    </Col>
                </Row>

                {/* ===== DỰ ÁN ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Dự án tiêu biểu</h5>
                        {highlightProjects.length > 0 ? (
                            <ul>
                                {highlightProjects.map((p, i) => (
                                    <li key={i}>{p.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Chưa có dự án.</p>
                        )}
                    </Col>
                </Row>

                {/* ===== CHỨNG CHỈ ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Chứng chỉ</h5>
                        {certificates.length > 0 ? (
                            <ul>
                                {certificates.map((c, i) => (
                                    <li key={i}>{c.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Chưa có chứng chỉ.</p>
                        )}
                    </Col>
                </Row>

                {/* ===== GIẢI THƯỞNG ===== */}
                <Row className="mt-4">
                    <Col>
                        <h5 className="text-success">Giải thưởng</h5>
                        {awards.length > 0 ? (
                            <ul>
                                {awards.map((a, i) => (
                                    <li key={i}>{a.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">Chưa có giải thưởng.</p>
                        )}
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default CandidateDetails;