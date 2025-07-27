import React from "react";
import classNames from "classnames";

const RecruiterTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "thông tin công ty", label: "🏢 Thông tin Công ty" },
    { id: "danh sách công việc", label: "📄 Danh sách công việc" },
    { id: "danh sách ứng viên", label: "👤 Danh sách ứng viên" },
  ];

  return (
    <div className="nav flex-column nav-pills gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`btn text-start ${
            activeTab === tab.id
              ? "btn-primary text-white"
              : "btn-light text-dark"
          }`}
          style={{
            borderRadius: "8px",
            backgroundColor: activeTab === tab.id ? "#16C47F" : "#f8f9fa",
            color: activeTab === tab.id ? "white" : "#212529",
            border: "1px solid #dee2e6",
            fontWeight: activeTab === tab.id ? "600" : "400",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default RecruiterTabs;
