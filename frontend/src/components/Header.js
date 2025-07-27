import React, { useEffect, useState, useContext } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import avatar from '../assets/img/avatar.png';
import SidebarProfile from './SidebarProfile';
import { AuthContext } from '../contexts/AuthContext';
import RecruiterService from '../services/RecruiterService';

const Header = () => {
  const { user } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const [recruiterProfile, setRecruiterProfile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

   useEffect(() => {
    if (!user?.accessToken) return;
  
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
        setRecruiterProfile(recruiterData);
      })
      .catch((error) => {
        console.error("❌ Lỗi khi gọi API RecruiterService.getProfile:", error);
      });
  }, [user]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
        <a className="navbar-brand fw-bold" style={{
          color: '#3A7D44', fontSize: '2rem'
        }} href="/">
          Nhà tuyển dụng
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

          <form className="d-flex me-3 mt-2 mt-lg-0">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search jobs"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>

          <button className="btn btn-primary me-3 mt-2 mt-lg-0">Post Job</button>

          {/* Avatar Dropdown - sử dụng React Bootstrap */}
          <Dropdown align="end" className="mt-2 mt-lg-0">
            <Dropdown.Toggle
              as="div"
              style={{ cursor: 'pointer' }}
              className="d-flex align-items-center"
            >
              <img
                src={avatar}
                alt="avatar"
                className="rounded-circle"
                style={{ width: '40px', height: '40px' }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setShowProfile(true)}>Thông tin</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </nav>

      {/* Modal hiển thị thông tin tài khoản */}
      <Modal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#06923E' }}>Thông tin tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#16C47F' }}>
          <SidebarProfile profileInfo={recruiterProfile} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
