import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const RecruiterTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['Thông tin Công ty', 'Danh sách công việc', 'Danh sách ứng viên'];

  return (
    <ul className="nav nav-tabs mb-4">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab}>
          <button
            className={`nav-link ${activeTab.toLowerCase() === tab.toLowerCase() ? 'active' : ''}`}
            onClick={() => onTabChange(tab.toLowerCase())}
          >
            {tab}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default RecruiterTabs;