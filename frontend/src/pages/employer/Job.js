import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";
import { getExpirationDateTwoMonthsLater } from '../../utils/expireDate';
import { useNavigate, useParams } from 'react-router-dom';
import { Pagination } from "react-bootstrap";
import { ReactComponent as EyeIcon } from '../../assets/icon/eye.svg';
import { ReactComponent as EditIcon } from '../../assets/icon/pencil.svg';
import { ReactComponent as TrashIcon } from '../../assets/icon/trash.svg';
import { ReactComponent as PersonIcon } from '../../assets/icon/person.svg';
import { ReactComponent as AcceptIcon } from '../../assets/icon/accept.svg';
import { ReactComponent as DenyIcon } from '../../assets/icon/deny.svg';
import { Table, Modal, Button } from "react-bootstrap";
import ApplicationService from '../../services/ApplicationService';
import { Link } from "react-router-dom";

const Job = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);
    const [showConfirmModalAcceptDeny, setShowConfirmModalAcceptDeny] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [actionType, setActionType] = useState(""); // "accept" hoặc "deny"
    const jobsPerPage = 5;
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.accessToken) return;

        JobService.getJobsByRecruiterId(user.accessToken)
            .then((res) => setJobs(res.data.data))
            .catch((err) => console.error("Lỗi khi lấy danh sách job:", err));

        ApplicationService.getApplicationsByRecruiter(user.accessToken)
            .then((res) => setApplications(res.data.data)) // <-- ứng viên
            .catch((err) => console.error("Lỗi khi lấy ứng viên:", err));
    }, [user]);

    const getApplicantCountByJobId = (jobId) => {
        return applications.filter(app => app.jobId?._id === jobId).length;
    };

    console.log("app:", applications.map(app => app.jobId?._id));

    const handleViewApplicants = (jobId) => {
        setSelectedJobId(jobId);
        setShowApplicantsModal(true);
    };

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

    const confirmAction = (id, type) => {
        setSelectedAppId(id);
        setActionType(type); // "accept" hoặc "deny"
        setShowConfirmModal(true);
    };

    const handleConfirmedAction = async () => {
        try {
            if (actionType === "accept") {
                await ApplicationService.acceptApplication(selectedAppId, user.accessToken);
                setApplications((prev) =>
                    prev.map((app) =>
                        app._id === selectedAppId ? { ...app, status: "accept" } : app
                    )
                );
            } else if (actionType === "deny") {
                await ApplicationService.rejectApplication(selectedAppId, user.accessToken);
                setApplications((prev) =>
                    prev.map((app) =>
                        app._id === selectedAppId ? { ...app, status: "reject" } : app
                    )
                );
            }
        } catch (error) {
            console.error("Lỗi khi xử lý yêu cầu:", error);
        } finally {
            setShowConfirmModal(false);
            setSelectedAppId(null);
            setActionType("");
        }
    };

    return (
        <div className="p-4">
            {jobs.length ? (
                <>
                    <div className="table-responsive">
                        <Table bordered hover className="align-middle text-center" >
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
                                        <td>{getApplicantCountByJobId(job._id)}</td>
                                        <td className="text-center">
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
                                                <button
                                                    onClick={() => handleViewApplicants(job._id)}
                                                    title="Xem ứng viên"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        padding: 0,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <PersonIcon style={{ width: '18px', height: '18px' }} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/*  Pagination */}
                    <style>
                        {`
                .page-item.active .page-link {
                    background-color: #06923E !important;
                    border-color: #06923E !important;
                    color: white !important;
                }
            `}
                    </style>

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
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {actionType === "accept" ? (
                        <>
                            Bạn có chắc chắn muốn <strong style={{ color: '#06923E' }}>chấp nhận</strong> đơn ứng tuyển này?
                        </>
                    ) : (
                        <>
                            Bạn có chắc chắn muốn <strong style={{ color: '#dc3545' }}>từ chối</strong> đơn ứng tuyển này?
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Hủy</Button>
                    <Button variant={actionType === "accept" ? "success" : "danger"} onClick={handleConfirmedAction}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showApplicantsModal} onHide={() => setShowApplicantsModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-success">Danh sách ứng viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {applications.filter(app => app.jobId?._id === selectedJobId).length === 0 ? (
                        <p>Chưa có ứng viên nào ứng tuyển.</p>
                    ) : (
                        <div className="table-responsive">
                            <Table bordered hover className="text-center align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ color: '#06923E' }}>STT</th>
                                        <th style={{ color: '#06923E' }}>Họ tên</th>
                                        <th style={{ color: '#06923E' }}>Email</th>
                                        <th style={{ color: '#06923E' }}>Số điện thoại</th>
                                        <th style={{ color: '#06923E' }}>Trạng thái</th>
                                        <th style={{ color: '#06923E' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications
                                        .filter(app => app.jobId?._id === selectedJobId)
                                        .map((app, index) => {
                                            console.log("app:", app);
                                            return (
                                                <tr key={app._id}>
                                                    <td>{index + 1}</td>
                                                    <td>{app.candidateId?.accountId?.fullName || 'Chưa cập nhật'}</td>
                                                    <td>{app.candidateId?.accountId?.email || 'N/A'}</td>
                                                    <td>{app.candidateId?.profile?.phoneNumber || 'Chưa cập nhật'}</td>
                                                    <td>{app.status}</td>
                                                    <td className="text-center">
                                                        {console.log("Candidate ID:", app.candidateId)}
                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                            <Link
                                                                to={`/candidate/${app.candidateId._id}`}
                                                                onClick={() => localStorage.setItem("candidateData", JSON.stringify(app.candidateId))}
                                                                state={{ candidate: app.candidateId }}
                                                                target="_blank"
                                                                title="Xem chi tiết"
                                                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                                            >
                                                                <EyeIcon style={{ width: '18px', height: '18px' }} />
                                                            </Link>
                                                            <button
                                                                onClick={() => confirmAction(app._id, "accept")}
                                                                title="Chấp nhận"
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    padding: 0,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <AcceptIcon style={{ width: '18px', height: '18px' }} />
                                                            </button>
                                                            <button
                                                                onClick={() => confirmAction(app._id, "deny")}
                                                                title="Từ chối"
                                                                style={{
                                                                    background: 'none',
                                                                    border: 'none',
                                                                    padding: 0,
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <DenyIcon style={{ width: '18px', height: '18px' }} />
                                                            </button>


                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowApplicantsModal(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Job;
