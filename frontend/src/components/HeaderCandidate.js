import { NavLink, useNavigate } from "react-router-dom";

function HeaderCandidate() {


  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    navigate("/candidate/login");
  };
  return (
    <header className="navbar navbar-expand-lg" style={{
      background: "linear-gradient(90deg, #91C8E4, #749BC2, #4682A9)"
    }}>
      <div className="container">
        {/* Logo */}
        <NavLink className="navbar-brand fw-bold fs-3 text-light" to="/">
          TimViec
        </NavLink>

        {/* Toggle button (mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link text-light" to="/">Công việc</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-light" to="/candidate/companies">Công ty</NavLink>
            </li>
            <li className="nav-item">
              <a
                href="/employer/login"
                className="nav-link text-light"
              >
                Cho nhà tuyển dụng
              </a>
            </li>
          </ul>

          {/* Login/Logout */}
          <div className="d-flex align-items-center ms-3">
            {!fullName ? (
              <>
                <NavLink className="btn btn-outline-light me-2" to="/candidate/login">Đăng nhập</NavLink>
                <NavLink className="btn btn-light" to="/candidate/register">Đăng kí</NavLink>
              </>
            ) : (
              <>
                <span className="me-3 text-light">Xin chào, {fullName}</span>
                <button className="btn btn-light" onClick={handleLogout}>Đăng xuất</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderCandidate;
