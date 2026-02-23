import React, { useEffect, useState, useContext } from 'react';
import { Dropdown, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import avatar from '../assets/img/avatar.png';
import SidebarProfile from './SidebarProfile';
import { AuthContext } from '../contexts/AuthContext';
import RecruiterService from '../services/RecruiterService';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const { user } = useContext(AuthContext);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [recruiterProfile, setRecruiterProfile] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
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

  console.log("🔥 Header rendered");


  return (
 

      <Navbar expand="lg" style={{
        background: "linear-gradient(to right, #2f8451ff, #135a44ff)",
        padding: "12px 0"
      }}>
        <Container className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <Navbar.Brand href="/" className="text-white fw-bold">
            <span style={{ color: "white", fontWeight: "bold", fontSize: 28 }}>Tìm</span>viec
          </Navbar.Brand>



          {/* Right Menu */}
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link href="#" className="text-white mx-3 fw-semibold">Dành cho nhà tuyển dụng</Nav.Link>
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
                <Dropdown.Item onClick={() => navigate("/employer/profile/details")}>
                  Hồ sơ Timviec
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </Nav>
        </Container>
      </Navbar>


  );
};

export default Header;
