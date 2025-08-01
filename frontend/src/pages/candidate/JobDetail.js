import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJob();
  }, [id]);

  if (!job) return <p className="container my-5">Loading job details...</p>;

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-primary-custom">{job.title}</h2>
        <p className="text-muted">
          📍 {job.address?.city}, {job.address?.country} • {job.employmentType}
        </p>
        <p>{job.description}</p>
        <p className="fw-bold">💰 Salary: {job.salaryMin} - {job.salaryMax} USD</p>
        <button className="btn btn-custom">Apply Now</button>
      </div>
    </div>
  );
}

export default JobDetail;