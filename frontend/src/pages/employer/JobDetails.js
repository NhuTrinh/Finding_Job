import React, { useEffect, useState, useContext, } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import JobService from '../../services/JobService'; // bạn nên có 1 service gọi API
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import company from '../../assets/img/company.jpg';
import Job from './Job'; // Giả sử bạn có component Job để hiển thị danh sách công việc
import { getExpirationDateTwoMonthsLater } from '../../utils/expireDate';
import { AuthContext } from '../../contexts/AuthContext';

const JobDetail = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await JobService.getJobById(id); // gọi API lấy job theo ID
                console.log("Job data:", res.data);
                setJob(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết job:", error);
            }
        };

        fetchJob();
    }, [id]);

    const handleDeleteJob = async () => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xoá công việc này không?');
        if (!confirmDelete) return;

        try {
            await JobService.deleteJob(id, user.accessToken);
            alert('Xoá công việc thành công.');
            navigate('/employer/dashboard'); // hoặc '/employer/jobs' nếu phù hợp hơn
        } catch (err) {
            alert('Lỗi khi xoá công việc.');
            console.error(err);
        }
    };

    if (!job) return <p>Đang tải thông tin công việc...</p>;

    return (
        <Container className="my-5">
            <Card className="p-4 shadow-lg rounded-4">
                <Row>
                    <Col md={8}>
                        <h2 className="mb-3">{job.title}</h2>
                        <p><strong>Hình thức:</strong> {job.employmentType}</p>
                        <p><strong>Địa điểm:</strong> {job.address.line}, {job.address.city}, {job.address.country}</p>
                        <p><strong>Ngày hết hạn:</strong> {getExpirationDateTwoMonthsLater(job.createdAt)}</p>

                        <hr />

                        <h5 className="mt-4">Mô tả công việc</h5>
                        <p>{job.description}</p>

                        <h5 className="mt-4">Yêu cầu ứng viên</h5>
                        {(job.skills?.length || job.jobExpertise?.length || job.jobDomain?.length) ? (
                            <>
                                {job.skills?.length > 0 && (
                                    <div>
                                        <strong>Kỹ năng:</strong>
                                        <ul>
                                            {job.skills.map((skill, index) => (
                                                <li key={index}>{skill}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {job.jobExpertise?.length > 0 && (
                                    <div>
                                        <strong>Chuyên môn:</strong>
                                        <ul>
                                            {job.jobExpertise.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {job.jobDomain?.length > 0 && (
                                    <div>
                                        <strong>Lĩnh vực:</strong>
                                        <ul>
                                            {job.jobDomain.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Không có yêu cầu cụ thể</p>
                        )}

                        <h5 className="mt-4">Quyền lợi</h5>
                        <p>{job.salaryMin} - {job.salaryMax} $</p>
                    </Col>

                    <Col md={4} className="border-start ps-4">
                        <Card className="mb-3 p-3 text-center">
                            <Card.Img variant="top" src={company} className="mb-3 rounded" />
                            <h6>Về công ty</h6>
                            <p>{job.company?.about || "Công ty chuyên về công nghệ, luôn đổi mới và sáng tạo."}</p>

                            <h6 className="mt-3">Cơ hội phát triển</h6>
                            <ul className="text-start small">
                                <li>Môi trường năng động, sáng tạo</li>
                                <li>Đào tạo chuyên sâu</li>
                                <li>Phát triển kỹ năng leadership</li>
                            </ul>
                        </Card>
                        <div className="d-flex justify-content-between mt-2">
    <a
        href={`/employer/jobs/${job._id}/edit`}
        className="btn btn-warning"
        target="_blank"
        rel="noopener noreferrer"
    >
        Cập nhật
    </a>
    <button
        className="btn btn-danger"
        onClick={() => handleDeleteJob(job._id)}
    >
        Xóa
    </button>
</div>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default JobDetail;