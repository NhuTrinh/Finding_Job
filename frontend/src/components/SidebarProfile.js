import React, { useState, useContext } from 'react';
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

  const handleSubmit = () => {
    if (!user?.accessToken) return;

    const updatedProfile = {
      fullName: form.userName,
      email: form.useremail,
    };

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
      <div className="bg-light p-4 rounded shadow-sm">
        <div className="text-center">
          <img
            src={avatar}
            alt="Avatar"
            className="rounded-circle mb-3"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <h5 className="fw-bold">{profileInfo.userName}</h5>
          <button
            className="btn btn-outline-primary w-100 mb-3"
            onClick={() => {
              setOriginalForm({ ...form });
              setShowModal(true);
            }}
          >
            Câp nhật thông tin
          </button>
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Email:</strong> {profileInfo.useremail}
          </li>
          <li className="list-group-item">
            <strong>Company:</strong> {profileInfo.companyName}
          </li>
          <li className="list-group-item">
            <strong>Address:</strong> {profileInfo.companyLine}, {profileInfo.companyCity},{" "}
            {profileInfo.companyCountry}
          </li>
        </ul>

        <div className="mt-3">
          <h6>About</h6>
          <p className="small text-muted">
            {profileInfo.companyAbout ||
              "Chưa có mô tả về công ty."}
          </p>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thông tin</Modal.Title>
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
          <Button variant="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SidebarProfile;