import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Gọi API login
      const res = await api.post("/accounts/candidate/login", { email, password });
      console.log("🔑 Login response:", res.data);

      // Lưu token
      localStorage.setItem("accessToken", res.data.token);

      // 2️⃣ Gọi API profile để lấy fullName
      const profileRes = await api.get("/candidates/profile-cv");
      console.log("👤 Profile response:", profileRes.data);

      // ✅ Lấy trực tiếp fullName từ root object
      localStorage.setItem("fullName", profileRes.data.fullName);

      // 3️⃣ Chuyển hướng về trang chủ
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err.response || err);
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-danger">{error}</p>}
          <button type="submit" className="btn btn-primary w-100">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
