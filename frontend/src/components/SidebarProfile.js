import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SidebarProfile = ({ recruiter }) => {
  return (
    <div className="bg-light p-4 rounded shadow-sm">
      <div className="text-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Avatar"
          className="rounded-circle mb-3"
        />
        <h5 className="fw-bold">{recruiter.fullName}</h5>
        <p className="text-muted">{recruiter.location || 'Hanoi, Vietnam'}</p>
        <button className="btn btn-outline-primary w-100 mb-3">Update Info</button>
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>Email:</strong> {recruiter.email}
        </li>
        <li className="list-group-item">
          <strong>Company:</strong> {recruiter.companyName}
        </li>
        <li className="list-group-item">
          <strong>Address:</strong> {recruiter.company?.address?.line}, {recruiter.company?.address?.city}, {recruiter.company?.address?.country}
        </li>
      </ul>

      <div className="mt-3">
        <h6>About</h6>
        <p className="small text-muted">
          {recruiter.about || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit, velit non.'}
        </p>
      </div>
    </div>
  );
};

export default SidebarProfile;
