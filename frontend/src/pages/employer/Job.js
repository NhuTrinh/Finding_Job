import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import ApplicationService from "../../services/ApplicationService";
import { AuthContext } from "../../contexts/AuthContext";
import { getExpirationDateTwoMonthsLater } from "../../utils/expireDate";
import { Pagination, Table, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { ReactComponent as EyeIcon } from "../../assets/icon/eye.svg";
import { ReactComponent as EditIcon } from "../../assets/icon/pencil.svg";
import { ReactComponent as TrashIcon } from "../../assets/icon/trash.svg";
import { ReactComponent as PersonIcon } from "../../assets/icon/person.svg";
import { ReactComponent as AcceptIcon } from "../../assets/icon/accept.svg";
import { ReactComponent as DenyIcon } from "../../assets/icon/deny.svg";

const Job = () => {
  const { user } = useContext(AuthContext);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    if (!user?.accessToken) return;

    JobService.getJobsByRecruiterId(user.accessToken)
      .then((res) => setJobs(res.data.data))
      .catch((err) => console.error("Lỗi khi lấy jobs:", err));

    ApplicationService.getApplicationsByRecruiter(user.accessToken)
      .then((res) => setApplications(res.data.data))
      .catch((err) => console.error("Lỗi khi lấy applications:", err));
  }, [user]);

  /* ================= HELPERS ================= */

  const getApplicantCountByJobId = (jobId) =>
    applications.filter((app) => app.jobId?._id === jobId).length;

  const handleViewApplicants = (jobId) => {
    setSelectedJobId(jobId);
    setShowApplicantsModal(true);
  };

  const confirmAction = (id, type) => {
    setSelectedAppId(id);
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmedAction = async () => {
    try {
      if (actionType === "accept") {
        await ApplicationService.acceptApplication(selectedAppId, user.accessToken);
      } else {
        await ApplicationService.rejectApplication(selectedAppId, user.accessToken);
      }

      setApplications((prev) =>
        prev.map((app) =>
          app._id === selectedAppId
            ? { ...app, status: actionType === "accept" ? "accept" : "reject" }
            : app
        )
      );
    } catch (err) {
      console.error("Lỗi xử lý application:", err);
    } finally {
      setShowConfirmModal(false);
      setSelectedAppId(null);
      setActionType("");
    }
  };

  /* ================= PAGINATION ================= */

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  /* ================= RENDER ================= */

  return (
    <div className="p-4">
      {jobs.length ? (
        <>
          <Table bordered hover className="text-center align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Ngày tạo</th>
                <th>Hạn nộp</th>
                <th>Số ứng viên</th>
                <th>Thao tác</th>
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
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <a href={`/job/${job._id}`} target="_blank" rel="noreferrer">
                        <EyeIcon width={18} />
                      </a>
                      <a href={`/employer/jobs/${job._id}/edit`}>
                        <EditIcon width={18} />
                      </a>
                      <button
                        style={{ background: "none", border: "none" }}
                        onClick={() => handleViewApplicants(job._id)}
                      >
                        <PersonIcon width={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      ) : (
        <p>Chưa có công việc nào</p>
      )}

      {/* ================= MODAL APPLICANTS ================= */}

      <Modal
        show={showApplicantsModal}
        onHide={() => setShowApplicantsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-success">Danh sách ứng viên</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {applications.filter((app) => app.jobId?._id === selectedJobId).length === 0 ? (
            <p>Chưa có ứng viên.</p>
          ) : (
            <Table bordered hover className="text-center align-middle">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {applications
                  .filter((app) => app.jobId?._id === selectedJobId)
                  .map((app, index) => {
                    const candidate = app.candidateId;

                    return (
                      <tr key={app._id}>
                        <td>{index + 1}</td>
                        <td>{candidate?.accountId?.fullName || "Chưa có hồ sơ"}</td>
                        <td>{candidate?.accountId?.email || "N/A"}</td>
                        <td>{candidate?.profile?.phoneNumber || "N/A"}</td>
                        <td>{app.status}</td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            {candidate ? (
                              <Link
                                to={`/candidate/${candidate.accountId?._id}`}
                                onClick={() =>
                                  localStorage.setItem(
                                    "candidateData",
                                    JSON.stringify(candidate)
                                  )
                                }
                              >
                                <EyeIcon width={18} />
                              </Link>
                            ) : (
                              <span className="text-muted">N/A</span>
                            )}

                            <button
                              onClick={() => confirmAction(app._id, "accept")}
                              style={{ background: "none", border: "none" }}
                            >
                              <AcceptIcon width={18} />
                            </button>

                            <button
                              onClick={() => confirmAction(app._id, "deny")}
                              style={{ background: "none", border: "none" }}
                            >
                              <DenyIcon width={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApplicantsModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ================= CONFIRM MODAL ================= */}

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn{" "}
          <strong>{actionType === "accept" ? "chấp nhận" : "từ chối"}</strong> đơn này?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button
            variant={actionType === "accept" ? "success" : "danger"}
            onClick={handleConfirmedAction}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Job;