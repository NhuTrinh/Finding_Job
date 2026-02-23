import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api";

function ApplicationCard({ job }) {
  const navigate = useNavigate();

  const handleCancelApply = async () => {
  // Kiểm tra trạng thái trước
  if (job?.status === 'accept' || job?.status === 'reject') {
    Swal.fire('Không thể hủy!', 'Ứng tuyển đã được duyệt hoặc từ chối, không thể hủy.', 'warning');
    return;
  }

  const result = await Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: 'Hành động này sẽ hủy ứng tuyển của bạn.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Có, hủy ngay',
    cancelButtonText: 'Không',
    reverseButtons: true
  });

  if (result.isConfirmed) {
    try {
      const res = await api.delete(`/applications/${job?._id}`);
      Swal.fire('Đã hủy!', 'Bạn đã hủy ứng tuyển thành công.', 'success');
      window.location.reload();
    } catch (err) {
      Swal.fire('Lỗi!', 'Đã xảy ra lỗi khi hủy ứng tuyển.', 'error');
    }
  }
};
    
    console.log("Jobs: ", job)

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary-custom">{job?.jobId?.jobTitle}</h5>
          <p className="card-text">
            📍 {job?.jobId?.address?.line || "Chưa cập nhật"}, {job?.jobId?.address?.city || "Chưa cập nhật"}, {job?.jobId?.address?.country || "Chưa cập nhật"}
          </p>
          <p>{job.description || "No description available."}</p>
          <p className="fw-bold text-dark">
            💰 {job?.jobId?.salaryMin || 0} - {job?.jobId?.salaryMax || 0} USD
                  </p>
                  
                  <p className="fw-bold text-success"> Trạng thái: {job?.status}
          </p>
          <button
            onClick={handleCancelApply}
            className="btn btn-danger w-100 mt-2"
          >
            Hủy Ứng tuyển
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;