import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { Divider } from '@mui/material'
import { removeGroup } from '../store/board/board.actions'
import { Icon } from '@vibe/core'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { Delete } from '@vibe/icons'

export function SuggestedActions({ board, group, updateFooterGroupRemoved }) {
	const [anchorEl, setAnchorEl] = useState(null)
	const open = Boolean(anchorEl)
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget)
	}
	const handleMenuClose = () => {
		setAnchorEl(null)
	}
	const handleRemoveGroup = async () => {
		try {
			updateFooterGroupRemoved(null, group)
			await removeGroup(group)
			showSuccessMsg('Group removed successfully')
		} catch (err) {
			showErrorMsg('Failed to remove group')
			console.error(err)
		}
	}
	const handleDelete = async () => {
		try {
			updateFooterGroupRemoved(null, group)
			await removeGroup(group)
			showSuccessMsg('Group removed successfully')
		} catch (err) {
			showErrorMsg('Failed to remove group')
			console.log(err)
		}
	}
	return (
		<div className='sa-main-container'>
			<Button
				id='basic-button'
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				sx={{
					color: 'rgb(50, 51, 56)',
					padding: 0,
					minWidth: '0px',
				}}>
				<MoreHorizIcon
					sx={{
						height: '20px',
						width: '20px',
					}}
				/>
			</Button>
			<Menu
				id='basic-menu'
				anchorEl={anchorEl}
				open={open}
				onClose={handleMenuClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				slotProps={{
					paper: {
						sx: {
							zIndex: 1300,
							borderRadius: '8px',
							color: '#333333',
							fontSize: '15px',
							fontWeight: '400',
							padding: 0,
							fontFamily: 'Figtree, Roboto, sans-serif',
							boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
							width: '240px',
						},
					},
					list: { sx: { padding: '8px' } },
				}}
				disableAutoFocusItem
				disableEnforceFocus
				disableRestoreFocus>
				<MenuItem
					onClick={(event) => {
						event.stopPropagation()
						handleDelete()
					}}
					sx={{
						display: 'flex',
						gap: '10px',
						alignItems: 'center',
						cursor: 'pointer',
						'&:hover': { backgroundColor: '#f5f5f5' },
					}}>
					<Icon iconType="svg" icon={Delete} iconSize={20} style={{ alignSelf: 'start' }} />
					<span>Remove Board</span>
				</MenuItem>
			</Menu>
		</div>
	)
}
