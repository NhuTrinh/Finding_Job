import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) newErrors.email = "Email không được để trống";
    else if (!emailRegex.test(email)) newErrors.email = "Email không hợp lệ";

    if (!password.trim()) newErrors.password = "Mật khẩu không được để trống";

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setFormErrors({});

    try {
      // 1) Login candidate
      const res = await api.post("/accounts/candidate/login", { email, password });

      // Lưu token dùng chung cho toàn app
      localStorage.setItem("accessToken", res.data.token);

      // 2) Lấy profile để hiện tên trên header
      const profileRes = await api.get("/candidates/me");
      const profileData = profileRes.data?.data || profileRes.data || {};
      localStorage.setItem("fullName", profileData.fullName || "Ứng viên");

      setSuccessMessage("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err.response || err);
      setError(err.response?.data?.detail || err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <h2 className="text-center mb-4" style={{ color: "#0D5EA6", fontWeight: "bold" }}>
        Đăng nhập ứng viên
      </h2>

      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          backgroundColor: "#91C8E4",
          borderRadius: "20px",
          padding: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="mb-3">
          <label className="form-label" style={{ color: "black" }}>
            Email <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormErrors((prev) => ({ ...prev, email: "" }));
              setError("");
            }}
            placeholder="Nhập email của bạn"
          />
          {formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label" style={{ color: "black" }}>
            Mật khẩu <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormErrors((prev) => ({ ...prev, password: "" }));
              setError("");
            }}
            placeholder="Nhập mật khẩu"
          />
          {formErrors.password && <div className="text-danger mt-1">{formErrors.password}</div>}
        </div>

        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "#0D5EA6", color: "white", fontWeight: "600" }}
        >
          Đăng nhập
        </button>

        <div className="text-center mt-3">
          <Link to="/candidate/register" className="text-decoration-none" style={{ fontWeight: "bold" }}>
            Chưa có tài khoản? Đăng ký ngay
          </Link>
        </div>

        <div className="text-center mt-2">
          <Link to="/employer/login" className="text-decoration-none text-dark">
            Bạn là nhà tuyển dụng?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;