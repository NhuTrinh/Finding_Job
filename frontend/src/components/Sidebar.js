import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="col-3 bg-light p-4 border-end" style={{ minHeight: "100vh" }}>
      <h4 className="text-primary mb-4">📌 Nhà tuyển dụng</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start ${activeTab === "newJob" ? "fw-bold text-primary" : ""}`}
            onClick={() => setActiveTab("newJob")}
          >
            Đăng tin
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start ${activeTab === "jobs" ? "fw-bold text-primary" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            Việc đã đăng
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link btn btn-link text-start ${activeTab === "info" ? "fw-bold text-primary" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;