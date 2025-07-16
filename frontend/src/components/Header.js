// src/components/Header.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import avatar from '../assets/img/avatar.png';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-4">
      <a className="navbar-brand fw-bold text-primary" href="/">Nhà tuyển dụng</a>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        </ul>

        <form className="d-flex me-3">
          <input className="form-control me-2" type="search" placeholder="Search jobs" aria-label="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>

        <button className="btn btn-primary me-3">Post Job</button>
        <img
          src={avatar}
          alt="avatar"
          className="rounded-circle"
          style={{ width: '40px', height: '40px' }}
        />
      </div>
    </nav>
  );
};

export default Header;
