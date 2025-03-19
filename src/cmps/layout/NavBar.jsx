// src/Navbar.jsx
import React, { useCallback, useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { getSvg } from '../../services/util.service'
import { useSelector } from 'react-redux'
import { Counter, Avatar as VibeAvatar } from '@vibe/core'
import { Notifications } from '@vibe/icons'

const SvgIcon = ({ iconName, options }) => {
	return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}

const NavBar = () => {
	const user = useSelector((storeState) => storeState.userModule.user)

  // For updates notification counter in the future

	// const maxCount = 10
	// const initialCount = 4
	// const [count, setCount] = useState(4)

	// const changeCountCallback = useCallback(() => {
	// 	const newCount = count === maxCount ? initialCount : count + 1
	// 	setCount(newCount)
	// }, [count, setCount])

	// useEffect(() => {
	// 	setCount(initialCount)
	// }, [initialCount, setCount])

	// useEffect(() => {
	// 	const interval = setInterval(changeCountCallback, 1000)
	// 	return () => {
	// 		clearInterval(interval)
	// 	}
	// }, [changeCountCallback])

	return (
		<nav className='navbar'>
			{/* Logo */}
			<div className='navbar-logo'>
				<img
					src='https://res.cloudinary.com/ofirgady/image/upload/v1742378354/kom2ycnxmfdgcvmfet8z.svg'
					alt='Logo'
				/>
        {/* <SvgIcon iconName={'app_logo'} /> */}

				<span className='navBar-company-name'>monday</span>
				<span className='navBar-logo-title'>work management</span>
			</div>

			{/* Navigation Links */}
			<div className='navbar-links'>
				<div className='navbar-link'>
					<SvgIcon iconName={'navbar_bell'} />
						{/* <Counter
							count={count}
              // size='small'
							maxDigits={1}
							color='negative'
							className='storybook-counter_counter-position-top'
						/> */}
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
				<div className='navbar-link'>
					<SvgIcon iconName={'navbar_search'} />
				</div>
				<div className='navbar-link'>
					<SvgIcon iconName={'navbar_help'} />
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
				<Avatar
					className='navbar-avatar'
					alt='User Avatar'
					src={user ? user.imgUrl : 'https://cdn1.monday.com/dapulse_default_photo.png'}
					sx={{ width: 32, height: 32 }}
				/>
			</div>
		</nav>
	)
}

export default NavBar
