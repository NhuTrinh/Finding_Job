import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import avatar from "../../assets/img/avatar.png";
import { FaRegBuilding } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Swal from "sweetalert2";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        const payload = res.data?.data ?? res.data; // hỗ trợ cả wrapper và non-wrapper
        setJob(payload);
      } catch (err) {
        console.error("Lỗi lấy chi tiết job:", err);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setIsApplying(true);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire("Lỗi", "Bạn cần đăng nhập để ứng tuyển.", "error");
        return;
      }

      
      await api.post("/candidate/applications", { jobId: id });

      await Swal.fire({
        icon: "success",
        title: "Ứng tuyển thành công!",
        text: "Chúc bạn may mắn!",
      });
    } catch (err) {
      const status = err?.response?.status;

      if (status === 409) {
        Swal.fire({
          icon: "error",
          title: "Bạn đã ứng tuyển",
          text: "Bạn đã ứng tuyển công việc này trước đó.",
        });
      } else if (status === 401 || status === 403) {
        Swal.fire({
          icon: "error",
          title: "Không có quyền",
          text: "Bạn cần đăng nhập tài khoản ứng viên để ứng tuyển.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err?.response?.data?.detail || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        });
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) return <p className="container my-5">Loading job details...</p>;

  return (
    <div
      className="container my-4 p-4 rounded"
      style={{ background: "linear-gradient(135deg, #91C8E4, #749BC2, #4682A9)", color: "white" }}
    >
      <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">
        <div className="d-flex align-items-center mb-4">
          <img src={avatar} alt="Logo" width={80} className="me-4 rounded-circle" />
          <div>
            <h3 className="fw-bold mb-1">{job.title}</h3>
            <span className="text-success d-block mb-2">💵 You'll love it</span>
            <Link
              to={`/candidate/companies/${job.companyId}`}
              className="btn btn-link text-muted p-0 text-decoration-none"
            >
              <FaRegBuilding className="me-2" style={{ color: "#6f42c1" }} />
              Xem chi tiết thông tin công ty. <span style={{ color: "#007bff" }}>Click vào đây</span>
            </Link>
          </div>
        </div>

        <button
          className="btn btn-danger w-100 rounded-pill mb-4 py-2"
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? "Đang ứng tuyển..." : "Ứng tuyển"}
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="mb-3">📍 Địa điểm & Hình thức làm việc</h5>
        <ul className="list-unstyled text-muted mb-0">
          <li className="mb-2">
            <FaLocationDot className="me-2" />
            {job.address?.line}, {job.address?.city}, {job.address?.country}
          </li>
          <li>🏢 {job.employmentType || "Tại văn phòng"}</li>
        </ul>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="mb-3">🛠️ Kỹ năng yêu cầu</h5>
        <div className="d-flex flex-wrap gap-2">
          {job.skills?.length > 0 ? (
            job.skills.map((skill, i) => (
              <span key={i} className="badge bg-light text-dark border">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-muted">Không yêu cầu kỹ năng cụ thể</span>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
        <h5 className="mb-3">🎓 Chuyên môn</h5>
        <div className="d-flex flex-wrap gap-2">
          {job.jobExpertise?.length > 0 ? (
            job.jobExpertise.map((item, i) => (
              <span key={i} className="badge bg-secondary">
                {item}
              </span>
            ))
          ) : (
            <span className="text-muted">Chưa có thông tin chuyên môn</span>
          )}
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h5 className="mb-3">🏷️ Lĩnh vực</h5>
        <div className="d-flex flex-wrap gap-2">
          {job.jobDomain?.length > 0 ? (
            job.jobDomain.map((field, i) => (
              <span key={i} className="badge bg-light border text-dark">
                {field}
              </span>
            ))
          ) : (
            <span className="text-muted">Chưa có thông tin lĩnh vực</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetail;