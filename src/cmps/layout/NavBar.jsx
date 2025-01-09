// src/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import QuestionMarkOutlinedIcon from "@mui/icons-material/QuestionMarkOutlined";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import Avatar from "@mui/material/Avatar";

const NavBar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src="./icon.svg" alt="Logo" />
        <span>monday </span> work management
      </div>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/workspace/board/xxx" className="navbar-link">
          <NotificationsOutlinedIcon />
        </Link>
        <Link to="/workspace/board/xxx" className="navbar-link">
          <PersonAddAltOutlinedIcon />
        </Link>{" "}
        <Link to="/workspace/board/xxx" className="navbar-link">
          <ExtensionOutlinedIcon />
        </Link>{" "}
        <Link to="/workspace/board/xxx" className="navbar-link">
          <SearchOutlinedIcon />
        </Link>{" "}
        <Link to="/workspace/board/xxx" className="navbar-link">
          <QuestionMarkOutlinedIcon />
        </Link>
        <span
          style={{
            fontFamily: "cursive",
            fontWeight: "lighter",
          }}
        >
          |
        </span>
        <Link to="/workspace/board/xxx" className="navbar-link appsroundedicon">
          <AppsRoundedIcon />
        </Link>
        <Avatar
          className="navbar-avatar"
          alt="User Avatar"
          src=""
          sx={{ width: 32, height: 32 }}
        />
      </div>
    </nav>
  );
};

export default NavBar;
