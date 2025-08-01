import { useState } from "react";
import api from "../../api";

function Register() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await api.post("/accounts/candidate/register", { fullName: fullname, email, password });
      setSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center text-primary-custom fw-bold mb-4">Đăng ký</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Họ và tên</label>
            <input type="text" className="form-control" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-custom w-100">Đăng ký</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
