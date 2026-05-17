import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import '../styles/Header.css';

const Header = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

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

        <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>Dashboard</Link>
        <Link to="/data-entry" className="mobile-nav-link" onClick={closeMenu}>Data Entry</Link>
        <Link to="/stock" className="mobile-nav-link" onClick={closeMenu}>Stock View</Link>
        <Link to="/reports" className="mobile-nav-link" onClick={closeMenu}>Reports</Link>
        <div className="mobile-user-info">Logged in as <strong>{user?.username}</strong> ({user?.role})</div>
        <button className="mobile-logout-btn" onClick={handleLogout}>
          <FiLogOut /> &nbsp;Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
