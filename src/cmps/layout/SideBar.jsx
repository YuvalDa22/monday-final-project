// Sidebar.jsx
//import React from "react";
import { Divider } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { StarBorderOutlined } from '@mui/icons-material'
import { boardService } from '../../services/board.service'

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

import React, { useState, useEffect } from 'react'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation() // Get current route
  const match = location.pathname.match(/\/workspace\/board\/([^/]+)/) // since SideBar isn't inside <Route> in RootCmp we can't use useParams
  const boardId = match ? match[1] : null

  const [allBoardsTitle, setAllBoardsTitle] = useState([])

  useEffect(() => {
    fetchBoardsTitle()
  }, [])
  const fetchBoardsTitle = async () => {
    const titles = await boardService.getAllBoardsTitle()
    setAllBoardsTitle(titles)
  }
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
          {/*obj looks like this {id: XXX , title: YYY} */}
          {allBoardsTitle.map((obj) => {
            return (
              <div
                key={obj.id}
                onClick={() => {
                  navigate(`/workspace/board/${obj.id}`)
                  window.location.reload() // Forces a refresh
                }}
              >
                <li className={`workspace-item ${boardId === obj.id ? 'active' : ''}`}>
                  <SvgIcon iconName={'sidebar_workspace_projectIcon'} />
                  <span className='textInSidebar'>{obj.title}</span>
                </li>
              </div>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
