import { useEffect, useState } from "react";
import api from "../../api";
import JobCard from "../../components/JobCard";
import SearchBar from "../../components/SearchBar";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchJobs = async (query, type) => {
  try {
    let url = "/jobs";
    if (type === "jobs") url = `/jobs?search=${query}`;
    if (type === "location") url = `/jobs?location=${query}`;
    const res = await api.get(url);
    setJobs(res.data.jobs || []);
  } catch (err) {
    console.error("Error searching jobs:", err);
  }
};


  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-4 text-primary-custom text-center">Các công việc mới nhất</h2>
      <SearchBar placeholder="Search jobs (e.g., React, Java)..." onSearch={handleSearchJobs} />
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="row">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p>No jobs available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
