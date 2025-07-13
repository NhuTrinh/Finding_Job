import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (user?.accessToken) {
      JobService.getJobsByRecruiterId(user.accessToken)
        .then((response) => {
          setJobs(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching jobs:", error);
        });
    }
  }, [user]);
    return (
    <div>
      <h2>Danh sách công việc đã đăng</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job._id}>{job.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployerDashboard;