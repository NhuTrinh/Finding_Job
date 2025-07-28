import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";
import { getExpirationDateTwoMonthsLater } from '../../utils/expireDate';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from "react-bootstrap";
import { ReactComponent as EyeIcon } from '../../assets/icon/eye.svg';
import { ReactComponent as EditIcon } from '../../assets/icon/pencil.svg';
import { ReactComponent as TrashIcon } from '../../assets/icon/trash.svg';
import { Table, Modal, Button } from "react-bootstrap";

const Job = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const jobsPerPage = 5; // 👈 số job hiển thị mỗi trang

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.accessToken) return;

        JobService.getJobsByRecruiterId(user.accessToken)
            .then((res) => setJobs(res.data.data))
            .catch((err) => console.error("Lỗi khi lấy danh sách job:", err));
    }, [user]);

    // ✅ Phân trang client
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(jobs.length / jobsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const confirmDelete = (jobId) => {
        setJobToDelete(jobId);
        setShowConfirmModal(true);
    };

    const handleDelete = async (jobId) => {
        try {
            await JobService.deleteJob(jobToDelete, user.accessToken);
            setJobs(prev => prev.filter(job => job._id !== jobToDelete));
        } catch (err) {
            console.error("Lỗi khi xóa job:", err);
        } finally {
            setShowConfirmModal(false);
            setJobToDelete(null);
        }
    };

    return (
        <div className="p-4">
            {jobs.length ? (
                <>
                    <div className="table-responsive">
                        <Table bordered hover className="align-middle text-center">
                            <thead className="table-light" >
                                <tr>
                                    <th></th>
                                    <th style={{ color: '#06923E' }}>Tiêu đề</th>
                                    <th style={{ color: '#06923E' }}>Ngày tạo</th>
                                    <th style={{ color: '#06923E' }}>Hạn nộp</th>
                                    <th style={{ color: '#06923E' }}>Số lượng ứng viên</th>
                                    <th style={{ color: '#06923E' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentJobs.map((job, index) => (
                                    <tr key={job._id}>
                                        <td>{indexOfFirstJob + index + 1}</td>
                                        <td>{job.title}</td>
                                        <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                        <td>{getExpirationDateTwoMonthsLater(job.createdAt)}</td>
                                        <td>{job.applications?.length || 0}</td>
                                        <td className="text-center">
                                            <a
                                                href={`/job/${job._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Xem chi tiết"
                                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                            >
                                                <EyeIcon style={{ width: '18px', height: '18px' }} />
                                            </a>

                                            <a
                                                href={`/employer/jobs/${job._id}/edit`}
                                                title="Chỉnh sửa"
                                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                            >
                                                <EditIcon style={{ width: '18px', height: '18px' }} />
                                            </a>

                                            <button
                                                onClick={() => confirmDelete(job._id)}
                                                title="Xóa"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    padding: 0,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <TrashIcon style={{ width: '18px', height: '18px' }} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* ✅ Pagination */}
                    <Pagination className="justify-content-center mt-3">
                        <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Pagination.Item
                                key={page}
                                active={page === currentPage}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </>
            ) : (
                <p>Chưa có việc nào</p>
            )}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xóa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có chắc chắn muốn xóa công việc này không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
        <Button variant="danger" onClick={handleDelete}>Xóa</Button>
      </Modal.Footer>
    </Modal>
        </div>
    );
};

export default Job;
