// Sidebar.jsx
//import React from "react";
import { Divider } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { StarBorderOutlined } from '@mui/icons-material'

const SvgIcon = ({ iconName, options = { height: '17', width: '17', color: 'currentColor' } }) => {
  return (
    <i
      className={`${iconName}`} // to fix annoying icons not being in the center
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      style={{
        pointerEvents: 'none',
      }}
    ></i>
  ) // So clicking directly on the SVG won't create an ugly black background
}

export default function Sidebar() {
  const location = useLocation() // Get current route
  return (
    <div className='sidebar'>
      {/* Navigation Links */}
      <ul className='sidebar-links'>
        <Link to='/workspace' style={{ all: 'unset' }}>
          <li className={`sidebar-item ${location.pathname === '/workspace' ? 'active' : ''}`}>
            <SvgIcon iconName={'sidebar_home'} /> <span className='textInSidebar'>Home</span>
          </li>
        </Link>

        <li
          className={`sidebar-item ${
            location.pathname.includes('/workspace/myWork') ? 'active' : ''
          }`}
        >
          <SvgIcon iconName={'sidebar_myWork'} /> <span className='textInSidebar'>My work</span>
        </li>
      </ul>
      <Divider className='divider' />
      <ul className='sidebar-links'>
        <li className='sidebar-item'>
          <SvgIcon iconName='sidebar_favorites' />
          <span className='textInSidebar' style={{ position: 'relative', right: 2 }}>
            Favorites
          </span>
        </li>
      </ul>
      <Divider className='divider' />
      <ul className='sidebar-links'>
        <li
          className={`sidebar-item ${
            location.pathname.includes('/workspace/workspaces') ? 'active' : ''
          }`}
        >
          <SvgIcon iconName={'sidebar_workspaces'} />
          <span className='textInSidebar'>Workspaces</span>
        </li>
      </ul>
      {/* Workspace Section */}
      <div className='workspace-section'>
        <ul className='workspace-links'>
          <Link to='/workspace/board/b101' style={{ all: 'unset' }}>
            <li
              className={`workspace-item ${
                location.pathname.includes('/workspace/board/b101') ? 'active' : ''
              }`}
            >
              <SvgIcon iconName={'sidebar_workspace_projectIcon'} />
              <span className='textInSidebar'>Main Workspace</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  )
}
