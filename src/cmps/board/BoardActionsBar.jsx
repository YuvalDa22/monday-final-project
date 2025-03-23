import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
	Box,
	Button,
	ButtonGroup,
	ClickAwayListener,
	darkScrollbar,
	IconButton,
	InputBase,
	IconButton as MuiIconButton,
	Stack as MuiStack,
	Popover,
	Typography,
} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { getSvg } from '../../services/util.service'
import { useEffect, useRef, useState } from 'react'
import { loadBoards } from '../../store/board/board.actions'
import { Heading } from '@vibe/core'

const SvgIcon = ({ iconName, options, className }) => {
	return (
		<i
			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
			className={`svg-icon ${className || ''}`}></i>
	)
}

export function BoardActionsBar({ board, onAddTask, onAddGroup, filterBy, onSetFilterBy }) {
	const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
	const [isSearchInputVisible, setIsSearchInputVisible] = useState(false)
	const [boardBeforeFilter, setBoardBeforeFilter] = useState(board)

	const [anchorEl, setAnchorEl] = useState(null)

	const OnOpenFilterPopover = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	const searchRef = useRef(null)

	const handleClickAway = () => {
		setIsSearchInputVisible(false)
	}

	useEffect(() => {
		onSetFilterBy(filterByToEdit)
	}, [filterByToEdit])

	function handleFilterChange({ target }) {
		let { name: field, value, type } = target
		switch (type) {
			case 'number':
			case 'range':
				value = +value
				break
			case 'checkbox':
				value = target.checked
			default:
				break
		}
		setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
	}

	function handleAddTask(fromHeader) {
		onAddTask(board.groups[0], 'New Task', fromHeader)
	}

	const quickFiltersStyle = {
		display: 'flex',
		gap: 2,
		paddingTop: '8px',
		overflowY: 'hidden',
		overflowX: 'auto',
		height: '270px',
		scrollbarWidth: 'thin',
		scrollbarColor: '#c3c6d4 transparent',
	}

	const filterListStyle = {
		listStyle: 'none',
		padding: '4px 4px 0 0',
		margin: 0,
		overflowY: 'auto',
		overflowX: 'hidden',
		maxHeight: '230px',
		scrollbarWidth: 'thin',
		scrollbarColor: '#c3c6d4 transparent',
		paddingBottom: '20px',
	}

	const filterBtnStyle = {
		width: '150px',
		height: '32px',
		padding: '0 12px',
		fontSize: '14px',
		fontWeight: 400,
		textTransform: 'none',
		whiteSpace: 'nowrap',
		display: 'flex',
		alignItems: 'center',
		gap: '6px',
		justifyContent: 'space-between',
		border: 'none',
		borderRadius: '4px',
		color: '#323338',
		boxShadow: 'none',
		'&.MuiButton-outlined': {
			backgroundColor: '#f6f7fb',
			'&:hover': {
				backgroundColor: '#e9eaee',
				boxShadow: 'none',
			},
		},
		'&.MuiButton-contained': {
			backgroundColor: '#cce5ff',
			'&:hover': {
				backgroundColor: '#aed4fc',
				boxShadow: 'none',
			},
		},
	}

	const filterActive =
		filterByToEdit.groups.length ||
		filterByToEdit.tasks.length ||
		filterByToEdit.members.length ||
		filterByToEdit.statusLabels.length ||
		filterByToEdit.priorityLabels.length
			? 'active'
			: ''
	const searchActive = filterByToEdit.txt.length ? 'active' : ''

	const filterHeadertyle = { mb: 2, fontWeight: 600, color: '#353535', fontSize: '16px' }

	const { txt } = filterByToEdit
	return (
			// REMOVED ALL UNUSED BUTTONS TO COMMENTED OUT CODE - 23/03/2025


		<MuiStack direction='row' spacing='15px' className='board-actions-bar'>
			<ButtonGroup variant='contained' className='new-task-buttons'>
				<Button onClick={() => handleAddTask(true)} className='add-task-button'>
					New Task
				</Button>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<Button className='dropdown-button'>
							<SvgIcon
								className='arrow-icon'
								iconName='arrow_dropDown'
								options={{ height: 22, width: 22, color: 'white' }}
							/>
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							className='dropdown-content'
							side='bottom'
							align='start'
							sideOffset={5}
							style={{
								backgroundColor: 'white',
								border: '1px solid #ccc',
								borderRadius: '8px',
								padding: '6px',
								boxShadow: '0 4px 17px 6px rgba(0, 0, 0, 0.1)',
								animationDuration: '400ms',
								animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
								willChange: 'transform, opacity',
								width: '12rem',
							}}>
							<DropdownMenu.Item
								className='dropdown-item'
								style={{
									fontSize: '14px',
									color: '#323338',
									borderRadius: '3px',
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem',
									height: '25px',
									width: '100%',
									padding: '0 8px',
									position: 'relative',
									userSelect: 'none',
									outline: 'none',
									cursor: 'pointer',
								}}
								onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
								onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
								onClick={() => onAddGroup(true)}>
								<SvgIcon
									iconName='boardActionsBar_groupBy'
									options={{ height: 16, width: 16, color: '#676879' }}
								/>
								<span style={{ paddingBottom: '4px' }}>Add group of tasks</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</ButtonGroup>

			{isSearchInputVisible ? (
				<ClickAwayListener onClickAway={handleClickAway}>
					<Box ref={searchRef} component='form' className='search-txt-input'>
						<IconButton sx={{ padding: '4px 5px' }} aria-label='menu' disabled>
							<SearchOutlinedIcon className='icon' />
						</IconButton>

						<InputBase
							sx={{ ml: 1, flex: 1, fontSize: '15px' }}
							placeholder='Search this board'
							inputProps={{ 'aria-label': 'search' }}
							id='txt'
							name='txt'
							value={txt}
							onChange={handleFilterChange}
							autoFocus
						/>
						{/* <IconButton
							type='button'
							sx={{ p: '4px 5px', borderRadius: '5px' }}
							aria-label='search'>
							<SvgIcon
								iconName='boardActionsBar_searchOptions'
								options={{ height: 17, width: 17 }}
							/>
						</IconButton> */}
					</Box>
				</ClickAwayListener>
			) : (
				<MuiIconButton
					className={`icon-button ${searchActive}`}
					onClick={() => setIsSearchInputVisible(true)}>
					<SearchOutlinedIcon className='icon' />
					<span>Search</span>
				</MuiIconButton>
			)}
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_person' options={{ height: 22, width: 22 }} />
				<span>Person</span>
			</MuiIconButton>
			<MuiIconButton className={`icon-button ${filterActive}`} onClick={OnOpenFilterPopover}>
				<SvgIcon iconName='boardActionsBar_filter' options={{ height: 22, width: 22 }} />
				<span>Filter</span>
			</MuiIconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}>
				<Box sx={{ p: '16px 24px 24px 24px', width: 800, color: '#323338' }}>
					<Typography variant='h6' sx={filterHeadertyle}>
						Quick filters
					</Typography>

					<Box sx={quickFiltersStyle}>
						{/* Filter by Groups */}
						<Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Group
							</Typography>
							<ul style={filterListStyle}>
								{boardBeforeFilter?.groups?.map((group) => (
									<li key={group.id} style={{ marginBottom: '8px' }}>
										<Button
											disableRipple
											className='filter-button'
											variant={filterByToEdit.groups?.includes(group.id) ? 'contained' : 'outlined'}
											onClick={() => {
												console.log(`Group filter clicked - group.id: ${group.id}`)
												setFilterByToEdit((prev) => {
													const isSelected = prev.groups?.includes(group.id)
													return {
														...prev,
														groups: isSelected
															? prev.groups.filter((id) => id !== group.id) // Remove group
															: [...(prev.groups || []), group.id], // Add group
													}
												})
											}}
											sx={filterBtnStyle}>
											{group.title.length > 12 ? group.title.slice(0, 12) + '...' : group.title}
											<span
												style={{
													width: 10,
													height: 10,
													borderRadius: '50%',
													backgroundColor: group.style.color,
												}}
											/>
										</Button>
									</li>
								))}
							</ul>
						</Box>

						{/* Filter by Tasks */}
						<Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Tasks
							</Typography>
							<ul style={filterListStyle}>
								{boardBeforeFilter?.groups?.flatMap((group) =>
									group.tasks.map((task) => (
										<li key={task.id} style={{ marginBottom: '8px' }}>
											<Button
												disableRipple
												variant={filterByToEdit.tasks?.includes(task.id) ? 'contained' : 'outlined'}
												onClick={() => {
													console.log(`Task filter clicked - task.id: ${task.id}`)
													setFilterByToEdit((prev) => {
														const isSelected = prev.tasks?.includes(task.id)
														return {
															...prev,
															tasks: isSelected
																? prev.tasks.filter((id) => id !== task.id) // Remove task
																: [...(prev.tasks || []), task.id], // Add task
														}
													})
												}}
												sx={filterBtnStyle}>
												{task.title.length > 12 ? task.title.slice(0, 12) + '...' : task.title}
											</Button>
										</li>
									))
								)}
							</ul>
						</Box>

						{/* Filter by Members */}
						<Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Members
							</Typography>
							<ul style={filterListStyle}>
								{board?.members?.map((member) => (
									<li key={member._id} style={{ marginBottom: '8px' }}>
										<Button
											disableRipple
											variant={
												filterByToEdit.members?.includes(member._id) ? 'contained' : 'outlined'
											}
											onClick={() => {
												console.log(`Member filter clicked - member._id: ${member._id}`)
												setFilterByToEdit((prev) => {
													const isSelected = prev.members?.includes(member._id)
													return {
														...prev,
														members: isSelected
															? prev.members.filter((id) => id !== member._id) // Remove member
															: [...(prev.members || []), member._id], // Add member
													}
												})
											}}
											sx={filterBtnStyle}>
											{member.fullname.length > 12 ? member.fullname.slice(0, 12) + '...' : member.fullname}
											<img
												src={member.imgUrl}
												alt={member.fullname}
												style={{
													width: 24,
													height: 24,
													borderRadius: '50%',
												}}
											/>
										</Button>
									</li>
								))}
							</ul>
						</Box>

						{/* Filter by Status */}
						<Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Status
							</Typography>
							<ul style={filterListStyle}>
								{board?.labels
									?.filter((label) => label.id.startsWith('l1'))
									.map((label) => (
										<li key={label.id} style={{ marginBottom: '8px' }}>
											<Button
												disableRipple
												variant={
													filterByToEdit.statusLabels?.includes(label.id) ? 'contained' : 'outlined'
												}
												onClick={() => {
													console.log(`Status filter clicked - label.id: ${label.id}`)
													setFilterByToEdit((prev) => {
														const isSelected = prev.statusLabels?.includes(label.id)
														return {
															...prev,
															statusLabels: isSelected
																? prev.statusLabels.filter((id) => id !== label.id)
																: [...(prev.statusLabels || []), label.id],
														}
													})
												}}
												sx={filterBtnStyle}>
												{!label.title && 'No Status'}
												{label.title.length > 12 ? label.title.slice(0, 12) + '...' : label.title}

												<span
													style={{
														width: 10,
														height: 10,
														borderRadius: '50%',
														backgroundColor: label.color,
													}}
												/>
											</Button>
										</li>
									))}
							</ul>
						</Box>

						{/* Filter by Priority */}
						<Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Priority
							</Typography>
							<ul style={filterListStyle}>
								{board?.labels
									?.filter((label) => label.id.startsWith('l2'))
									.map((label) => (
										<li key={label.id} style={{ marginBottom: '8px' }}>
											<Button
												disableRipple
												variant={
													filterByToEdit.priorityLabels?.includes(label.id)
														? 'contained'
														: 'outlined'
												}
												onClick={() => {
													console.log(`Priority filter clicked - label.id: ${label.id}`)
													setFilterByToEdit((prev) => {
														const isSelected = prev.priorityLabels?.includes(label.id)
														return {
															...prev,
															priorityLabels: isSelected
																? prev.priorityLabels.filter((id) => id !== label.id)
																: [...(prev.priorityLabels || []), label.id],
														}
													})
												}}
												sx={filterBtnStyle}>
												{!label.title && 'No Status'}
												{label.title.length > 12 ? label.title.slice(0, 12) + '...' : label.title}
												<span
													style={{
														width: 10,
														height: 10,
														borderRadius: '50%',
														backgroundColor: label.color,
													}}
												/>
											</Button>
										</li>
									))}
							</ul>
						</Box>
					</Box>
				</Box>
			</Popover>
			{/* <MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_sort' options={{ height: 22, width: 22 }} />
				<span>Sort</span>
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_hide' options={{ height: 22, width: 22 }} />
				<span>Hide</span>
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_groupBy' options={{ height: 17, width: 17 }} />
				<span>Group by</span>
			</MuiIconButton> */}
		</MuiStack>
	)
}
