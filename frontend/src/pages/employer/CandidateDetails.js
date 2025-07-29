import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';

const CandidateDetails = () => {
    const location = useLocation();
    const [candidate, setCandidate] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stateCandidate = location.state?.candidate;

        if (stateCandidate) {
            // Có candidate trong state → set và lưu vào localStorage
            setCandidate(stateCandidate);
            localStorage.setItem("candidateData", JSON.stringify(stateCandidate));
        } else {
            // Không có trong state (reload) → lấy từ localStorage
            const storedCandidate = localStorage.getItem("candidateData");
            if (storedCandidate) {
                setCandidate(JSON.parse(storedCandidate));
            }
        }
    }, [location.state]);

    if (!candidate) {
        return <p>Không có dữ liệu ứng viên.</p>;
    }
    const { accountId, profile, attachments } = candidate;

    const skills = candidate?.profile?.skills?.[0] || { coreSkills: [], softSkills: [] };

    console.log("coreSkill: ", skills.coreSkills);
    console.log("softSkills: ", skills.softSkills);

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
            {/* Row 1: Thông tin ứng viên + Sidebar */}
            <Row>
                <Col md={8}>
                    <div className="p-3 border rounded bg-white">
                        <h2 className="mb-3 text-success">{accountId?.fullName}</h2>
                        <p><strong>Email:</strong> {accountId?.email}</p>
                        <p><strong>Điện thoại:</strong> {profile?.phoneNumber || 'Chưa cập nhật'}</p>
                        <p><strong>Ngày sinh:</strong> {profile?.birthDay ? new Date(profile.birthDay).toLocaleDateString() : 'Chưa cập nhật'}</p>
                        <p><strong>Linkedin:</strong> {profile?.link}</p>
                        <p><strong>Địa chỉ:</strong> {
                            profile?.address
                                ? `${profile.address.line || ''}, ${profile.address.city || ''}, ${profile.address.country || ''}, ${profile.address.city || ''}`
                                : 'Chưa cập nhật'
                        }</p>
                        <p><strong>Vị trí mong muốn:</strong> {profile?.jobTitle || 'Chưa cập nhật'}</p>
                    </div>
                </Col>

                <Col md={4} className="border-start ps-4">
                    <Card className="mb-3 p-3 text-center shadow-sm rounded-3 bg-light">
                        <Card.Img
                            variant="top"
                            src={profile.avatar || 'https://via.placeholder.com/150'}
                            className="mb-3 rounded"
                        />
                        <h6 className="fw-bold">🏠 Nơi làm việc mong muốn</h6>
                        {attachments?.preferredWorkLocation?.length > 0 ? (
                            <ul className="text-start small">
                                {attachments.preferredWorkLocation.map((loc, index) => (
                                    <li key={index}>{loc}</li>
                                ))}
                            </ul>
                        ) : <p className="small">Chưa chọn địa điểm.</p>}

                        <h6 className="mt-3 fw-bold">📎 File đính kèm</h6>
                        <p className="small">
                            {attachments?.uploadedAt
                                ? new Date(attachments.uploadedAt).toLocaleString()
                                : 'Không có file đính kèm'}
                        </p>
                    </Card>
                </Col>
            </Row>

            {/* Row 2: Giới thiệu bản thân */}
            <Row className="mt-4">
                <Col>
                    <div className="mb-4 border-bottom pb-3">
                        <h5 className="mb-2 text-success">Giới thiệu bản thân</h5>
                        <p>{profile?.aboutMe || 'Không có mô tả.'}</p>
                    </div>
                </Col>
            </Row>

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

            {profile?.foreignLanguages?.length > 0 ? (
                <ul className="ps-3 mb-0">
                    {profile.foreignLanguages.map((lang, index) => (
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
                        {profile?.workExperience?.length > 0 ? (
                            profile.workExperience.map((exp, index) => (
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

            {/* Row 5: Học vấn */}
            <Row>
    <Col md={8}>
        <div className="mb-4 border-bottom pb-3">
            <h5 className="mb-2 text-success">🎓 Học vấn</h5>
            {profile?.education?.length > 0 ? (
                profile.education.map((edu, index) => (
                    <div key={index} className="border rounded p-3 mb-3 shadow-sm">
                        <h6 className="mb-1 text-primary">{edu.schoolName}</h6>
                        <p className="mb-0"><strong>Ngành:</strong> {edu.major}</p>
                        <strong>Thời gian:</strong> {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}
                    </div>
                ))
            ) : (
                <p className="text-muted">Chưa cập nhật học vấn.</p>
            )}
        </div>
    </Col>
                </Row>

                <Row>
    <Col>
        <div className="mb-4 border-bottom pb-3">
            <h5 className="mb-2 text-success">Dự án tiêu biểu</h5>
            {profile?.highlightProjects?.length > 0 ? (
                <ul className="ps-3 mb-0">
                    {profile.highlightProjects.map((proj, index) => (
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
            {profile?.certificates?.length > 0 ? (
                <ul className="ps-3 mb-0">
                    {profile.certificates.map((cert, index) => (
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
            {profile?.awards?.length > 0 ? (
                <ul className="ps-3 mb-0">
                    {profile.awards.map((award, index) => (
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

export default CandidateDetails;