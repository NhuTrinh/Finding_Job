import React, { useEffect, useState, useContext } from "react";
import JobService from "../../services/JobService";
import { AuthContext } from "../../contexts/AuthContext";
import SidebarProfile from "../../components/SidebarProfile.js";
import RecruiterTabs from "../../components/RecruiterTabs.js";
import JobGallery from "../../components/JobGallery.js";
import ViewMoreButton from "../../components/ViewMoreButton.js";
import Header from "../../components/Header.js";
import RecruiterService from "../../services/RecruiterService";
import CompanyService from "../../services/CompanyService";
import CompanyProfile from "./Company.js";

const EmployerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("info");
  const [recruiter, setRecruiter] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);


  useEffect(() => {
    if (!user?.accessToken) return;

    // 1. Gọi recruiter trước
    RecruiterService.getProfile(user.accessToken)
      .then((response) => {
        const raw = response.data;
        const recruiterData = {
          fullName: raw.fullName,
          email: raw.email,
          companyId: raw.recruiter?.companyId,
          position: raw.recruiter?.position,
          recruiterId: raw.recruiter?._id,
        };
        console.log("✅ recruiterData from API:", recruiterData);
        setRecruiter(recruiterData);

        // 2. Tiếp theo: Gọi company nếu có companyId
        if (recruiterData.companyId) {
          CompanyService.getCompanyById(recruiterData.companyId)
            .then((res) => {
              const companyData = res.data;
              console.log("✅ Company data from API:", companyData);
              setCompanies(companyData);

              // 3. Sau khi có cả recruiter + company → set profileInfo luôn tại đây
              setProfileInfo({
                userName: recruiterData.fullName,
                useremail: recruiterData.email,
                companyId: recruiterData.companyId,
                companyName: companyData.name,
                companyType: companyData.type,
                companyLine: companyData.address?.line,
                companyCity: companyData.address?.city,
                companyCountry: companyData.address?.country,
                companyAbout: companyData.overview,
                companyWebsite: companyData.websiteUrl, 
                companyFanpage: companyData.fanpageUrl,
                companySize: companyData.size,
                companyOvertime: companyData.Overtime,
                companyWorkingTime: companyData.workingDays,
                companySkills: companyData.keySkills,
                foundedYear: "2010",
                industry: companyData.industry,
                slogan: "Tương lai bắt đầu từ đây",
                companyCulture: companyData.perksContent
              });
            })
            .catch((error) => {
              console.error("Lỗi khi lấy thông tin công ty:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin recruiter:", error);
      });

    // 4. Lấy danh sách jobs song song
    JobService.getJobsByRecruiterId(user.accessToken)
      .then((res) => setJobs(res.data.data))
      .catch((error) => console.error("Error fetching jobs:", error));
  }, [user]);



  const imageList = [
    "https://picsum.photos/300/200?1",
    "https://picsum.photos/300/200?2",
    "https://picsum.photos/300/200?3",
    "https://picsum.photos/300/200?4",
    "https://picsum.photos/300/200?5",
    "https://picsum.photos/300/200?6",
  ];
  if (!profileInfo) return null;

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <div className="col-md-3 p-3">
          <SidebarProfile profileInfo={profileInfo} />
        </div>
        <div className="col-md-9 p-4">
          <RecruiterTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === "info" && (
            <>
              <SidebarProfile recruiter={profileInfo} />
              <CompanyProfile
                companyInfo={profileInfo}
                onUpdate={(updatedCompany) => {
                  // TODO: Gọi API cập nhật công ty ở đây
                  console.log("🔄 Cần cập nhật công ty:", updatedCompany);
                }}
              />
            </>
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