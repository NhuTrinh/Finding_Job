import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Link } from "react-router-dom"

function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]); // danh sách job đã lọc
  const [allJobs, setAllJobs] = useState([]);



  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get(`/companies/${id}`);
        console.log("Company Detail API:", res.data);
        setCompany(res.data || null);


        const jobRes = await api.get("/jobs");
        console.log("All job data: ", jobRes.data.jobs)

        const jobsData = jobRes.data.jobs || [];

        setAllJobs(jobsData || []);

        console.log("id: " + id);


        jobsData.forEach(job => {
          console.log("job.companyId:", job.companyId);
        });

        const filteredJobs = jobsData.filter(job => String(job.companyId) === String(id));
        setJobs(filteredJobs);

        console.log("setJobs: ", filteredJobs);

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
      {/* Card 1: Thông tin cơ bản */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h2 className="fw-bold mb-3">{company.name}</h2>
        <p className="mb-2">
          📍 <strong>Địa chỉ:</strong> {company.address?.line}, {company.address?.city}, {company.address?.country}
        </p>
        <p className="mb-2">🏢 <strong>Loại hình:</strong> {company.type}</p>
        <p className="mb-2">👥 <strong>Quy mô:</strong> {company.size}</p>
        <p className="mb-2">🗓️ <strong>Ngày làm việc:</strong> {company.workingDays}</p>
        <p className="mb-0">⏱️ <strong>Làm thêm:</strong> {company.Overtime}</p>
      </div>

      {/* Card 2: Giới thiệu */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h4 className="mb-3">📝 Giới thiệu</h4>
        <p className="mb-2"><strong>Tổng quan:</strong> {company.overview || "Chưa có mô tả."}</p>
        <p className="mb-2"><strong>Ngành nghề:</strong> {company.industry}</p>
        <p className="mb-0"><strong>Phúc lợi:</strong> {company.perksContent}</p>
      </div>

      {/* Card 3: Kỹ năng nổi bật */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h4 className="mb-3">💡 Kỹ năng nổi bật</h4>
        <div className="d-flex flex-wrap gap-2">
          {company.keySkills && company.keySkills.length > 0 ? (
            company.keySkills[0].split(',').map((skill, index) => (
              <span key={index} className="badge bg-light text-dark border">{skill.trim()}</span>
            ))
          ) : (
            <span className="text-muted">Không có kỹ năng nổi bật</span>
          )}
        </div>
      </div>

      {/* Card 4: Liên kết & Fanpage */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h4 className="mb-3">🔗 Liên kết</h4>
        <p className="mb-2">
          🌐 <strong>Website:</strong>{" "}
          <a href={company.websiteUrl} target="_blank" rel="noopener noreferrer">
            {company.websiteUrl}
          </a>
        </p>
        <p className="mb-0">
          📘 <strong>Fanpage:</strong>{" "}
          <a href={company.fanpageUrl} target="_blank" rel="noopener noreferrer">
            {company.fanpageUrl}
          </a>
        </p>
      </div>

      {/* Card 5: Danh sách việc làm */}
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <h4 className="mb-3">📋 Danh sách việc làm tại {company.name}</h4>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="border-bottom pb-2 mb-2">
              <Link to={`/jobs/${job._id}`} className="text-primary fw-bold">
                {job.title}
              </Link>
            </div>
          ))
        ) : (
          <p className="text-muted">Chưa có việc làm nào được đăng.</p>
        )}
      </div>
    </div>
  );
}

export default CompanyDetail;
