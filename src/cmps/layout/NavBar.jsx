// src/Navbar.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
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
        <img src='./icon.svg' alt='Logo' />
        <span className="navBar-company-name">monday</span> 
        <span className="navBar-logo-title">work management</span>
      </div>

      {/* Navigation Links */}
      <div className='navbar-links'>
        <Link to='/workspace/board/xxx' className='navbar-link'>
          <SvgIcon iconName={'navbar_bell'} />
        </Link>
        <Link to='/workspace/board/xxx' className='navbar-link'>
          <SvgIcon iconName={'navbar_updateFeed'} />
        </Link>{' '}
        <Link to='/workspace/board/xxx' className='navbar-link'>
          <SvgIcon iconName={'navbar_inviteMembers'} />
        </Link>{' '}
        <Link to='/workspace/board/xxx' className='navbar-link'>
          <SvgIcon iconName={'navbar_mondayMarketplace'} />
        </Link>{' '}
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
        <Link to='/workspace/board/xxx' className='navbar-link'>
          <SvgIcon iconName={'navbar_search'} />
        </Link>
        <Link to='/workspace/board/xxx' className='navbar-link'>
          <SvgIcon iconName={'navbar_help'} />
        </Link>
        <Avatar
          className='navbar-avatar'
          alt='User Avatar'
          src=''
          sx={{ width: 32, height: 32 }}
        />
      </div>
    </nav>
  )
}

export default NavBar
