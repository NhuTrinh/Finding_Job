import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewMoreButton = ({ onClick }) => {
  return (
    <div className="text-center my-4">
      <button className="btn btn-warning px-4 py-2 fw-semibold" onClick={onClick}>
        View More
      </button>
    </div>
  );
};

export default ViewMoreButton;