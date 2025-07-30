import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Dropdown, Modal } from 'react-bootstrap';
import avatar from '../assets/img/avatar.png';
import { AuthContext } from '../contexts/AuthContext';
import CandidateService from '../services/CandidateService';
import { useNavigate } from "react-router-dom";


const CandidateHeader = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [candidateProfile, setcandidateProfile] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await CandidateService.getProfile(user.accessToken); // gọi API lấy job theo ID
                console.log("Profile: ", res.data);
                setShowProfile(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết profile:", error);
            }
        };

        fetchUser();
    }, [user]);


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

                {/* Menu */}
                <Nav className="me-auto d-flex align-items-center">
                    <Nav.Link href="#" className="text-white mx-3 fw-semibold">Việc làm IT <i className="bi bi-caret-down-fill"></i></Nav.Link>
                    <Nav.Link href="#" className="text-white mx-3 fw-semibold">Top Công ty IT <i className="bi bi-caret-down-fill"></i></Nav.Link>


                </Nav>

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
                            <Dropdown.Item onClick={() => navigate("/candidate/profile/details")}>
                                Hồ sơ Timviec
                            </Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </Nav>
            </Container>
        </Navbar>
    );
}

export default CandidateHeader;