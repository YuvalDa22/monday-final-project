// Sidebar.jsx
//import React from "react";
import "../styles/_sidebar.scss";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <img src="https://via.placeholder.com/50" alt="Logo" className="logo" />
        <span className="logo-text">Work Management</span>
      </div>

      {/* Navigation Links */}
      <ul className="sidebar-links">
        <li className="sidebar-item">
          <span>Home</span>
        </li>
        <li className="sidebar-item">
          <span>My Work</span>
        </li>
        <li className="sidebar-item">
          <span>Favorites</span>
        </li>
        <li
          className="sidebar-item
        active"
        >
          <span>Workspaces</span>
        </li>
      </ul>

      {/* Workspace Section */}
      <div className="workspace-section">
        <h4 className="workspace-title">Workspaces</h4>
        <ul className="workspace-links">
          <li className="workspace-item">Main Workspace</li>
          {/* Add other workspaces if needed */}
        </ul>
      </div>

      {/* Dashboard Section */}
      <div className="dashboard-section">
        <h4 className="dashboard-title">Dashboard and Reporting</h4>
      </div>
    </div>
  );
}

export default Sidebar;
