import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const JobGallery = ({ images }) => {
  return (
    <div className="row g-3">
      {images.map((img, index) => (
        <div className="col-12 col-md-4" key={index}>
          <div className="card shadow-sm border-0">
            <img
              src={img}
              className="card-img-top rounded"
              alt={`job-${index}`}
              style={{ height: '200px', objectFit: 'cover' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobGallery;