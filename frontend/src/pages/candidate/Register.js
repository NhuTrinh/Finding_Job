import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, email, password, confirmPassword } = formData;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) newErrors.fullName = "Họ và tên không được để trống";
    if (!email.trim()) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";
    if (!password.trim()) newErrors.password = "Mật khẩu không được để trống";
    else if (password.length < 6) newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});

    try {
      // Nếu backend candidate register của nhóm bạn dùng endpoint khác, đổi tại đây
      await api.post("/accounts/candidate/register", {
        fullName,
        email,
        password,
      });

      setSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
      setTimeout(() => navigate("/candidate/login"), 1200);
    } catch (err) {
      console.error("❌ Register error:", err.response || err);
      setError(err.response?.data?.detail || err.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <h2 className="text-center mb-4" style={{ color: "#0D5EA6", fontWeight: "bold" }}>
        Đăng ký ứng viên
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#91C8E4",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-2">
          <label className="form-label" style={{ color: "black" }}>
            Họ và tên <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ tên"
          />
          {formErrors.fullName && <div className="text-danger">{formErrors.fullName}</div>}
        </div>

        <div className="mb-2">
          <label className="form-label" style={{ color: "black" }}>
            Email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập email"
          />
          {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
        </div>

        <div className="mb-2">
          <label className="form-label" style={{ color: "black" }}>
            Mật khẩu <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Tối thiểu 6 ký tự"
          />
          {formErrors.password && <div className="text-danger">{formErrors.password}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: "black" }}>
            Xác nhận mật khẩu <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Nhập lại mật khẩu"
          />
          {formErrors.confirmPassword && <div className="text-danger">{formErrors.confirmPassword}</div>}
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "#0D5EA6", color: "white", fontWeight: "600" }}
        >
          Đăng ký
        </button>

        <div className="text-center mt-3">
          <Link to="/candidate/login" className="text-decoration-none" style={{ fontWeight: "bold" }}>
            Đã có tài khoản? Đăng nhập ngay
          </Link>
        </div>

        <div className="text-center mt-2">
          <Link to="/employer/register" className="text-decoration-none text-dark">
            Bạn là nhà tuyển dụng?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;