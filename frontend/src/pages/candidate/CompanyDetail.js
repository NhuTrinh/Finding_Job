import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companies/${id}`);
        console.log("Company Detail API:", res.data);
        setCompany(res.data.data || null);
      } catch (err) {
        console.error("Error fetching company detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!company) return <p className="text-center text-danger mt-4">Company not found.</p>;

  return (
    <div
      className="container my-4 p-4 rounded"
      style={{ background: "linear-gradient(135deg, #91C8E4, #749BC2, #4682A9)", color: "white" }}
    >
      <h2 className="fw-bold mb-3">{company.name}</h2>
      <p className="mb-1">
        📍 <strong>Address:</strong> {company.address?.line || "N/A"},{" "}
        {company.address?.city || "N/A"},{" "}
        {company.address?.country || "N/A"}
      </p>
      <p className="mb-1">
        👥 <strong>Company Size:</strong> {company.size || "N/A"}
      </p>
      <p className="mb-4">
        📝 <strong>Description:</strong> {company.description || "No description provided."}
      </p>

      <h4 className="mt-4">Jobs at {company.name}</h4>
      <div className="mt-3">
        {company.jobs && company.jobs.length > 0 ? (
          <ul className="list-group">
            {company.jobs.map((job) => (
              <li
                key={job._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{job.title}</span>
                <span className="badge bg-primary">{job.employmentType}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No jobs available for this company.</p>
        )}
      </div>
    </div>
  );
}

export default CompanyDetail;
