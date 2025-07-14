import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";
import Sidebar from "../../components/Sidebar.js";
import NewJobForm from "../../components/NewJobForm";
import SidebarProfile from "../../components/SidebarProfile.js";
import RecruiterTabs from "../../components/RecruiterTabs.js";
import JobGallery from "../../components/JobGallery.js";
import ViewMoreButton from "../../components/ViewMoreButton.js";
import Header from "../../components/Header.js";

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  const recruiter = {
    fullName: user?.fullName || "Nguyen Van A",
    email: user?.email || "recruiter6@example.com",
    companyName: user?.companyName || "Công ty ABC",
    company: {
      address: {
        line: user?.company?.address?.line || "123 Đường Lê Lợi",
        city: user?.company?.address?.city || "Hà Nội",
        country: user?.company?.address?.country || "Việt Nam",
      },
    },
  };

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

 const imageList = [
    "https://picsum.photos/300/200?1",
    "https://picsum.photos/300/200?2",
    "https://picsum.photos/300/200?3",
    "https://picsum.photos/300/200?4",
    "https://picsum.photos/300/200?5",
    "https://picsum.photos/300/200?6",
  ];

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <div className="col-md-3 p-3">
          <SidebarProfile recruiter={recruiter} />
        </div>
        <div className="col-md-9 p-4">
          <RecruiterTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "info" && (
            <div className="card p-4">
              <h4 className="mb-4">👨‍💼 Thông tin nhà tuyển dụng</h4>
              <p><strong>Họ tên:</strong> {recruiter.fullName}</p>
              <p><strong>Email:</strong> {recruiter.email}</p>
              <p><strong>Công ty:</strong> {recruiter.companyName}</p>
              <p><strong>Địa chỉ:</strong> {recruiter.company.address.line}, {recruiter.company.address.city}, {recruiter.company.address.country}</p>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="card p-4">
              <h4 className="mb-3">📋 Việc đã đăng</h4>
              <ul>
                {jobs.length ? jobs.map((job) => <li key={job._id}>{job.title}</li>) : <li>Chưa có việc nào</li>}
              </ul>
            </div>
          )}

          {activeTab === "gallery" && (
            <>
              <JobGallery images={imageList} />
              <ViewMoreButton onClick={() => alert("Load more images...")} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;