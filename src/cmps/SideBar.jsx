// Sidebar.jsx
//import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import { Divider } from "@mui/material";

function Sidebar() {
  return (
    <div className="sidebar">
      {/* Navigation Links */}
      <ul className="sidebar-links">
        <li className="sidebar-item">
          <HomeOutlinedIcon /> <span>Home</span>
        </li>
        <li className="sidebar-item">
          <EventAvailableOutlinedIcon /> <span>My Work</span>
        </li>{" "}
        <Divider />
        <li className="sidebar-item">
          <StarOutlineOutlinedIcon />
          <span>Favorites</span>
        </li>
        <Divider />
        <br />
        <li className="sidebar-item">
          <GridViewOutlinedIcon />
          <span>Workspaces</span>
        </li>
      </ul>

      {/* Workspace Section */}
      <div className="workspace-section">
        <ul className="workspace-links">
          <li className="workspace-item active">Main Workspace</li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
