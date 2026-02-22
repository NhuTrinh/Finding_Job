import React, { useEffect, useState } from "react";
import CandidateHeader from "../../components/CandidateHeader";
import axios from "axios";

const CandidateDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/jobs");
                setJobs(res.data.data);
                console.log("jobs from API:", res.data.data);
                
            } catch (err) {
                console.error("Lỗi khi lấy danh sách công việc:", err);
            }
        };

        fetchJobs();
    }, []);

    // Lọc danh sách job theo từ khóa
    const filteredJobs = jobs.filter((job) => {
        const term = searchTerm.toLowerCase();
        const title = (job.title || "").toLowerCase();
        const city = (job.address?.city || "").toLowerCase();
        return title.includes(term) || city.includes(term);
    });

    return (
        <>
            <CandidateHeader />
            <div className="container mt-4">

                {/* Thanh tìm kiếm */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm công việc theo tên, công ty hoặc địa điểm..."
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <h2 className="mb-4">Danh sách công việc</h2>
                    <p>Jobs count: {jobs.length}</p>
                {filteredJobs.length === 0 ? (
                    <p>Không tìm thấy công việc phù hợp.</p>
                ) : (
                    <div className="row">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="col-md-4 mb-4">
                                <div className="p-3 border rounded shadow-sm h-100">
                                    <h5>{job.title}</h5>
                                    <p className="mb-1"><strong>Công ty ID:</strong> {job.companyId}</p>
                                    <p className="mb-1"><strong>Địa điểm:</strong> {job.address?.city}</p>
                                    <p className="mb-1"><strong>Lương:</strong> {job.salaryMin} - {job.salaryMax}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default CandidateDashboard;