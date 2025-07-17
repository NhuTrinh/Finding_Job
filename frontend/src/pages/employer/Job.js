import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";
import { getExpirationDateTwoMonthsLater } from '../../utils/expireDate';
import { useNavigate, useParams } from 'react-router-dom';

const Job = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.accessToken) return;

        JobService.getJobsByRecruiterId(user.accessToken)
            .then((res) => setJobs(res.data.data))
            .catch((err) => console.error("Lỗi khi lấy danh sách job:", err));
    }, [user]);

    

    return (
        <div className="p-4">
            {jobs.length ? (
                <div className="row">
                    {jobs.map((job) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={job._id}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{job.title}</h5>
                                    <p className="card-text text-muted">
                                        Hạn nộp: {getExpirationDateTwoMonthsLater(job.createdAt)}
                                    </p>
                                    <div className="d-flex justify-content-between">
                                        <a href={`/job/${job._id}`} className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer">
                                            Xem chi tiết
                                        </a>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Chưa có việc nào</p>
            )}
        </div>
    );
};

export default Job;