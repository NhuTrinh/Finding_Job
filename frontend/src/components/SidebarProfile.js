import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import RecruiterService from '../services/RecruiterService';
import { AuthContext } from '../contexts/AuthContext'; // Để lấy token
import avatar from '../assets/img/avatar.png';

const SidebarProfile = ({ profileInfo }) => {
  const { user } = useContext(AuthContext); // Lấy accessToken
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...profileInfo });
  const [originalForm, setOriginalForm] = useState({ ...profileInfo });


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClick = () => {
    setOriginalForm({ ...form });
    setShowModal(true);
  };

  console.log("SidebarProfile - profileInfo:", profileInfo);


  const handleSubmit = () => {
    if (!user?.accessToken) return;

    const updatedProfile = {
      fullName: form.userName,
      email: form.useremail,
    };
    if (!user?.accessToken) return;




    RecruiterService.updateProfile(user.accessToken, updatedProfile)
      .then(() => {
        console.log("✅ Cập nhật thành công");
        setShowModal(false);
        // Có thể cập nhật lại state cha ở EmployerDashboard nếu muốn
        window.location.reload(); // hoặc dùng callback để tránh reload
      })
      .catch((err) => {
        console.error("❌ Lỗi khi cập nhật:", err);
      });
  };

  if (!profileInfo) return null;

  return (
    <>
      <div className="p-4 rounded shadow-sm" style={{
        fontFamily: "'Segoe UI', sans-serif",
        backgroundColor: "#F9FAFB", // nền sáng nhẹ
        border: "1px solid #E5E7EB",
        color: "#111827",
      }}>
        <div className="text-center">
          <img
            src={avatar}
            alt="Avatar"
            className="rounded-circle mb-3"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              border: '3px solid white',
            }}
          />
          <h5 className="fw-bold" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{profileInfo.fullName}</h5>
          <button
            variant="outline-success"
            onClick={() => {
              setOriginalForm({ ...form });
              setShowModal(true);
            }}
            style={{
              backgroundColor: "white",
              color: "#06923E",
              border: "1px solid #0b5e3cff",
              borderRadius: "6px",
              fontWeight: "500",
            }}
          >
            Cập nhật thông tin
          </button>
        </div>

        <ul className="list-group list-group-flush" >
          <li className="list-group-item">
            <strong>Tên:</strong> {profileInfo.fullName}
          </li>
          <li className="list-group-item">
            <strong>Email:</strong> {profileInfo.email}
          </li>
        </ul>

      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#06923E' }}>Cập nhật thông tin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                name="userName"
                value={form.userName}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Nếu cho phép sửa công ty thì thêm các field ở đây */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setForm({ ...originalForm }); // Khôi phục dữ liệu
            setShowModal(false);         // Đóng modal
          }}>
            Hủy
          </Button>
          <Button variant="outline-success" onClick={handleSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SidebarProfile;