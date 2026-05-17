import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-logo">
            <span className="logo-icon">📦</span>
            <span className="logo-text">Yarn IMS</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/data-entry" className="nav-link">Data Entry</Link>
          <Link to="/stock" className="nav-link">Stock View</Link>
          <Link to="/reports" className="nav-link">Reports</Link>
        </nav>

        <div className="header-user">
          <span className="user-info">
            {user?.username} <span className="role-badge">{user?.role}</span>
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
