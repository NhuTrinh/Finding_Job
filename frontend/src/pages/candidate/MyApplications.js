import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CandidateApplicationService from "../../services/CandidateApplicationService";
import api from "../../api";

export default function MyApplications() {
    const [apps, setApps] = useState([]);
    const [jobsById, setJobsById] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await CandidateApplicationService.listMyApplications();
            const list = res.data?.data || [];
            setApps(list);

            // map jobId -> job detail (để hiển thị title/city)
            const uniqueJobIds = [...new Set(list.map((a) => a.jobId))];
            const jobPromises = uniqueJobIds.map((jid) => api.get(`/jobs/${jid}`));
            const jobResults = await Promise.allSettled(jobPromises);

            const map = {};
            jobResults.forEach((r) => {
                if (r.status === "fulfilled") {
                    map[r.value.data?._id] = r.value.data;
                }
            });
            setJobsById(map);
        } catch (err) {
            Swal.fire("Lỗi", "Không thể tải danh sách đơn ứng tuyển.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            Swal.fire("Lỗi", "Bạn cần đăng nhập để xem đơn ứng tuyển.", "error");
            setLoading(false);
            return;
        }
        fetchAll();
    }, []);

    const handleWithdraw = async (appId) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Rút đơn ứng tuyển?",
            text: "Bạn có chắc muốn rút đơn này không?",
            showCancelButton: true,
            confirmButtonText: "Rút đơn",
            cancelButtonText: "Huỷ",
        });

        if (!confirm.isConfirmed) return;

        try {
            await CandidateApplicationService.withdraw(appId);
            Swal.fire("Thành công", "Đã rút đơn ứng tuyển.", "success");
            // refresh list
            fetchAll();
        } catch (err) {
            const status = err?.response?.status;
            if (status === 403) Swal.fire("Không có quyền", "Bạn không thể rút đơn của người khác.", "error");
            else if (status === 404) Swal.fire("Không tìm thấy", "Đơn ứng tuyển không tồn tại.", "error");
            else Swal.fire("Lỗi", "Có lỗi xảy ra, vui lòng thử lại.", "error");
        }
    };

    const statusLabel = (s) => {
        if (s === "pending") return "Đang chờ";
        if (s === "withdrawn") return "Đã rút";
        if (s === "accepted") return "Đã chấp nhận";
        if (s === "rejected") return "Bị từ chối";
        return s || "";
    };

    return (
        <div className="container my-5">
            <h2 className="fw-bold mb-4 text-center">Đơn ứng tuyển của tôi</h2>

            {loading ? (
                <p>Loading...</p>
            ) : apps.length === 0 ? (
                <p>Chưa có đơn ứng tuyển nào.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead>
                            <tr>
                                <th>Job</th>
                                <th>Địa điểm</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th style={{ width: 160 }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apps.map((a) => {
                                const job = jobsById[a.jobId];
                                return (
                                    <tr key={a._id}>
                                        <td>{job?.title || a.jobId}</td>
                                        <td>{job?.address?.city || "-"}</td>
                                        <td>{statusLabel(a.status)}</td>
                                        <td>{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                disabled={a.status === "withdrawn"}
                                                onClick={() => handleWithdraw(a._id)}
                                            >
                                                Rút đơn
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}