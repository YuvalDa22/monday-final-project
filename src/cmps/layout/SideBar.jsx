import { Divider, Menu, MenuItem } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import {
	Button as ButtonVibe,
	IconButton as IconButtonVibe,
	Icon as IconVibe,
	Avatar as AvatarVibe,
	Menu as MenuVibe,
	MenuItem as MenuItemVibe,
	MenuButton as MenuButtonVibe,
	ListItem as ListItemVibe,
} from '@vibe/core'
import { Add as AddIcon, Home, Workspace, Board, Delete } from '@vibe/icons'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import React, { useState, useEffect } from 'react'
import { addBoard, getAllBoardsTitle, removeBoard } from '../../store/board/board.actions'
import { useSelector } from 'react-redux'
import { socketService } from '../../services/socket.service'

const SvgIcon = ({ iconName, options = { height: '17', width: '17', color: 'currentColor' } }) => {
	return (
		<i
			className={`${iconName}`} // to fix annoying icons not being in the center
			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
			style={{
				pointerEvents: 'none',
			}}></i>
	)
}

export default function Sidebar() {
	const navigate = useNavigate()
	const location = useLocation() // Get current route
	const match = location.pathname.match(/\/workspace\/board\/([^/]+)/) // since SideBar isn't inside <Route> in RootCmp we can't use useParams
	const boardId = match ? match[1] : null
	const [allBoardsTitle, setAllBoardsTitle] = useState([])
	const { boards } = useSelector((storeState) => storeState.boardModule)

	const [menuAnchor, setMenuAnchor] = useState(null)
	const [selectedBoard, setSelectedBoard] = useState(null)

	const handleMenuClick = (event, boardId) => {
		event.stopPropagation()
		setMenuAnchor(event.currentTarget)
		setSelectedBoard(boardId)
	}

	const handleMenuClose = () => {
		setMenuAnchor(null)
		setSelectedBoard(null)
	}

	const handleDelete = async () => {
		if (boards.some((board) => board._id === selectedBoard)) {
			await handleRemoveBoard(selectedBoard)
		}
		handleMenuClose()
	}

	useEffect(() => {
		fetchBoardsTitle()

		// Listen for board-added event
		socketService.on('board-added', (addedBoard) => {
			fetchBoardsTitle()
		})

		// Listen for board-deleted event
		socketService.on('board-deleted', (deletedBoardId) => {
			setAllBoardsTitle((prevBoards) => prevBoards.filter((board) => board.id !== deletedBoardId))
		})

		// Listen for board-title-updated event
		socketService.on('board-title-updated', ({ id, title }) => {
			setAllBoardsTitle((prevBoards) =>
				prevBoards.map((board) => (board.id === id ? { ...board, title } : board))
			)
			console.log('allBoardsTitle', allBoardsTitle)
		})

		return () => {
			socketService.off('board-added')
			socketService.off('board-deleted')
			socketService.off('board-title-updated')
		}
	}, [])

	const fetchBoardsTitle = async () => {
		try {
			const allTitles = await getAllBoardsTitle()
			setAllBoardsTitle(allTitles)
		} catch (err) {
			console.error(`couldn't get or set titles`, err)
			throw err
		}
	}

	async function onAddBoard() {
		try {
			const addedBoard = await addBoard()
			showSuccessMsg('Board added successfully')
			setAllBoardsTitle((prevBoards) => [
				...prevBoards,
				{ id: addedBoard._id, title: addedBoard.title },
			])
		} catch (err) {
			showErrorMsg(`Couldn't add board, please try again.`)
		}
	}

	async function onNavigateToBoard(event, obj) {
		if (event.target.closest('.menu-button') || event.target.closest('.remove-button')) return // Ignore clicks on the menu

		let boardExists = await fetchBoardsTitle()

		boardExists = allBoardsTitle.some((board) => board.id === obj.id)

		if (boardExists) {
			navigate(`/workspace/board/${obj.id}`)
		}
	}

	async function handleRemoveBoard(selectedBoardId) {
		try {
			await removeBoard(selectedBoardId) // Ensure deletion is processed

			// Immediately update the board list in state
			setAllBoardsTitle((prevBoards) => prevBoards.filter((board) => board.id !== selectedBoardId))

			// If the current board was deleted, navigate to `/workspace`
			if (boardId === selectedBoardId) {
				navigate('/workspace')
			}
		} catch (err) {
			console.error('Error removing board:', err)
			showErrorMsg(`Couldn't remove board, please try again`)
		}
	}

	return (

		// REMOVED ALL UNUSED BUTTONS TO COMMENTED OUT CODE - 23/03/2025
		<div className='sidebar'>
			{/* Navigation Links */}
			<div>
				<ul className='sidebar-links'>
					<Link to='/workspace' style={{ all: 'unset' }}>
						<li className={`sidebar-item ${location.pathname === '/workspace' ? 'active' : ''}`}>
							<IconVibe
								icon={Home}
								style={{
									height: '18px',
									width: '18px',
								}}
								className='sidebar_home'
							/>{' '}
							<span className='textInSidebar'>Home</span>
						</li>
					</Link>
				</ul>
			</div>
			<Divider className='divider' />
			{/* <div>
				<ul className='sidebar-links'>
					<li className='sidebar-item'>
						<SvgIcon iconName='sidebar_favorites' />
						<span className='textInSidebar' style={{ position: 'relative', right: 2 }}>
							Favorites
						</span>
					</li>
				</ul>
			</div>
			<Divider className='divider' />
			<div>
				<ul className='sidebar-links'>
					<li
						className={`sidebar-item ${
							location.pathname.includes('/workspace/workspaces') ? 'active' : ''
						}`}>
						<IconVibe
							icon={Workspace}
							style={{
								height: '18px',
								width: '18px',
							}}
							className='sidebar_workspaces'
						/>
						<span className='textInSidebar'>Workspaces</span>
					</li>
				</ul>
			</div> */}
			<div>

			</div>
			<div>
				<ul className='main-workspace'>
					<ButtonVibe
						size={ButtonVibe.sizes.SMALL}
						className='main-workspace-button'
						kind={ButtonVibe.kinds.TERTIARY}
						style={{
							width: '110%',
							border: '1px solid #d0d4e4',
						}}>
						<AvatarVibe
							size='xs'
							type='text'
							className='board-avatar-icon'
							text={'M'}
							backgroundColor={'#fdab3d'}
							bottomRightBadgeProps={{
								icon: Home,
								height: '14px',
								width: '14px',
								fill: 'black',
								size: 'medium',
								className: 'little-home-icon',
							}}
							square
						/>
						<span
							className='workspace-name'
							style={{
								marginLeft: '3px',
								textOverflow: 'clip',
								fontWeight: 'bold',
							}}>
							{'Main workspace'}
						</span>
					</ButtonVibe>

					<IconButtonVibe
						className='add-board-button'
						size={ButtonVibe.sizes.SMALL}
						kind={ButtonVibe.kinds.PRIMARY}
						ariaLabel='Add Board'
						icon={AddIcon}
						aria-disabled='false'
						style={{
							marginLeft: '8px',
							backgroundColor: '#0073ea',
							color: '#ffffff',
						}}
						onClick={onAddBoard}
					/>
				</ul>
			</div>
			<div className='workspace-section'>
				<ul className='workspace-links'>
					{allBoardsTitle.map((obj) => {
						const isMenuOpen = selectedBoard === obj.id && Boolean(menuAnchor)
						return (
							<ListItemVibe
								style={{ width: '100%' }}
								key={obj.id}
								onClick={(event) => onNavigateToBoard(event, obj)}
								className={`workspace-item ${boardId === obj.id ? 'active' : ''}`}>
								<IconVibe
									icon={Board}
									style={{ color: '#676879', height: '20px', width: '19px' }}
									className='sidebar_board'
								/>
								<span className='textInSidebar'>{obj.title}</span>
								<div className='menu-container'>
									<MenuButtonVibe
										className='menu-button'
										onClick={(event) => handleMenuClick(event, obj.id)}
										size='xs'
									/>
									<Menu
										anchorEl={menuAnchor}
										open={isMenuOpen}
										onClose={handleMenuClose}
										anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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
												padding: '4px 8px',
											}}>
											<IconVibe icon={Delete} iconSize={18} style={{ alignSelf: 'start' }} />
											<span style={{fontSize: '14px'}}>Remove Board</span>
										</MenuItem>
									</Menu>
								</div>
							</ListItemVibe>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
