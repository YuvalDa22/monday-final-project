// src/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}

const NavBar = () => {
  return (
    <nav className='navbar'>
      {/* Logo */}
      <div className='navbar-logo'>
        <img src='./icon.svg' alt='Logo'/>
      
        <span className='navBar-company-name'>monday</span>
        <span className='navBar-logo-title'>work management</span>
      </div>

      {/* Navigation Links */}
      <div className='navbar-links'>
        <div className='navbar-link'>
          <SvgIcon iconName={'navbar_bell'} />
        </div>
        <div className='navbar-link'>
          <SvgIcon iconName={'navbar_updateFeed'} />
        </div>
        <div className='navbar-link'>
          <SvgIcon iconName={'navbar_inviteMembers'} />
        </div>
        <div className='navbar-link'>
          <SvgIcon iconName={'navbar_mondayMarketplace'} />
        </div>
        <Divider
          orientation='vertical'
          flexItem
          sx={{
            borderColor: 'rgb(164, 164, 164)',
            borderWidth: '1px',
            opacity: 0.3,
            margin: '8px 0px 8px',
          }}
        />
        <div className='navbar-link'>
          <SvgIcon iconName={'navbar_search'} />
        </div>
        <div className='navbar-link'>
          <SvgIcon iconName={'navbar_help'} />
        </div>
        <Avatar
          className='navbar-avatar'
          alt='User Avatar'
          src='https://cdn1.monday.com/dapulse_default_photo.png'
          sx={{ width: 32, height: 32 }}
        />
      </div>
    </nav>
  )
}

export default NavBar
