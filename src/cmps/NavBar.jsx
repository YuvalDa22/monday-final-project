// src/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/_navbar.scss"; // Import the CSS file
const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src="/path-to-your-logo.png" alt="Logo" />
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/dashboard" className="navbar-link">
          Dashboard
        </Link>
        <Link to="/projects" className="navbar-link">
          Projects
        </Link>
        <Link to="/team" className="navbar-link">
          Team
        </Link>
      </div>

      {/* Right-side Icons */}
      <div className="navbar-right">
        <input type="text" placeholder="Search..." className="search-bar" />
        <div className="navbar-icon">
          <img src="/path-to-notification-icon.png" alt="Notifications" />
        </div>
        <div className="navbar-user">
          <img src="/path-to-user-icon.png" alt="User" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
