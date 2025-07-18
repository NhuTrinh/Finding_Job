import React, { useEffect, useState, useContext } from 'react';
import CandidateCard from '../../components/CandidateCard';
import ApplicationService from '../../services/ApplicationService';
import { AuthContext } from "../../contexts/AuthContext";
import { formatDate } from '../../utils/formatDate';

const RecruiterApplicationList = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

   const handleAccept = async (id) => {
  try {
    await ApplicationService.acceptApplication(id, user.accessToken);
    setApplications((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, status: "Chấp nhận" } : app
      )
    );
  } catch (error) {
    console.error("Lỗi khi chấp nhận:", error);
  }
};

const handleReject = async (id) => {
  try {
    await ApplicationService.rejectApplication(id, user.accessToken);
    setApplications((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, status: "Từ chối" } : app
      )
    );
  } catch (error) {
    console.error("Lỗi khi từ chối:", error);
  }
};



    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ApplicationService.getApplicationsByRecruiter(user.accessToken);
                setApplications(data.data.data);
            } catch (error) {
                console.error('Lỗi lấy danh sách ứng viên:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.accessToken]);

    if (loading) return <div className="text-center">Đang tải...</div>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Danh sách ứng viên</h2>
            {applications.length ? (
                <div className="row">
                    {applications.map((app) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={app._id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {app.candidateId?.fullName || 'Ứng viên 1'}
                                    </h5>
                                    <p className="card-text">
                                        Ngày nộp:{" "}
                                        {formatDate(app.createdAt)}
                                    </p>
                                    <p className="card-text text-muted">
                                        Trạng thái: <strong>{app.status}</strong>
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex gap-3">
                                            <button className="btn btn-success btn-sm" onClick={() => handleAccept(app._id)}>
                                                Chấp nhận
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleReject(app._id)}>
                                                Từ chối
                                            </button>
                                            <a
                                                href={`/candidate/${app.candidateId?._id || ''}`}
                                                className="btn btn-primary btn-sm"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Xem hồ sơ
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Chưa có ứng viên nào nộp</p>
            )}
        </div>
    );

};

export default RecruiterApplicationList;