import { useNavigate } from "react-router-dom";

function JobCard({ job }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/jobs/${job._id}`);
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title text-primary-custom">{job.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{job.jobTitle}</h6>
          <p className="card-text">
            📍 {job.address?.city || "Unknown City"} • {job.employmentType}
          </p>
          <p>{job.description || "No description available."}</p>
          <p className="fw-bold text-dark">
            💰 {job.salaryMin || 0} - {job.salaryMax || 0} USD
          </p>
          <button
            onClick={() => navigate(`/jobs/${job._id}`)}
            className="btn btn-danger w-100 mt-2"
          >
            Ứng tuyển
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;