import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
	Box,
	Button,
	ButtonGroup,
	ClickAwayListener,
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

	const { txt } = filterByToEdit
	return (
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
						<IconButton sx={{ p: '4px 5px' }} aria-label='menu' disabled>
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

						<IconButton
							type='button'
							sx={{ p: '4px 5px', borderRadius: '5px' }}
							aria-label='search'>
							<SvgIcon
								iconName='boardActionsBar_searchOptions'
								options={{ height: 17, width: 17 }}
							/>
						</IconButton>
					</Box>
				</ClickAwayListener>
			) : (
				<MuiIconButton className='icon-button' onClick={() => setIsSearchInputVisible(true)}>
					<SearchOutlinedIcon className='icon' />
					<span>Search</span>
				</MuiIconButton>
			)}
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_person' options={{ height: 22, width: 22 }} />
				<span>Person</span>
			</MuiIconButton>
			<MuiIconButton className='icon-button' onClick={OnOpenFilterPopover}>
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
				<Box sx={{ p: 2, minWidth: 600 }}>
					<Typography variant='h6' sx={{ mb: 2 }}>
						Filter Options
					</Typography>

					<Box sx={{ display: 'flex', gap: 3 }}>
						{/* Filter by Groups */}
						<Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Group
							</Typography>
							<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
								{boardBeforeFilter.groups.map((group) => (
									<li key={group.id} style={{ marginBottom: '8px' }}>
										<Button
											variant={filterByToEdit.groups?.includes(group.id) ? 'contained' : 'outlined'}
											onClick={() => {
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
											sx={{ width: '100%', textTransform: 'none' }}>
											{group.title}
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
							<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
								{boardBeforeFilter.groups.flatMap((group) =>
									group.tasks.map((task) => (
										<li key={task.id} style={{ marginBottom: '8px' }}>
											<Button
												variant={filterByToEdit.tasks?.includes(task.id) ? 'contained' : 'outlined'}
												onClick={() => {
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
												sx={{ width: '100%', textTransform: 'none' }}>
												{task.title}
											</Button>
										</li>
									))
								)}
							</ul>
						</Box>

						{/* Filter by Members */}
						{/* <Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Members
							</Typography>
							<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
								{board.members.map((member) => (
									<li key={member._id} style={{ marginBottom: '8px' }}>
										<Button
											variant={filterByToEdit.member === member._id ? 'contained' : 'outlined'}
											onClick={() => setFilterByToEdit((prev) => ({ ...prev, member: member._id }))}
											sx={{
												width: '100%',
												textTransform: 'none',
												display: 'flex',
												alignItems: 'center',
												gap: 1,
											}}>
											<img
												src={member.imgUrl}
												alt={member.fullname}
												style={{
													width: 24,
													height: 24,
													borderRadius: '50%',
												}}
											/>
											{member.fullname}
										</Button>
									</li>
								))}
							</ul>
						</Box> */}

						{/* Filter by Status */}
						{/* <Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Status
							</Typography>
							<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
								{board.labels
									.filter((label) => label.id.startsWith('l1'))
									.map((status) => (
										<li key={status.id} style={{ marginBottom: '8px' }}>
											<Button
												variant={filterByToEdit.status === status.id ? 'contained' : 'outlined'}
												onClick={() =>
													setFilterByToEdit((prev) => ({ ...prev, status: status.id }))
												}
												sx={{
													width: '100%',
													textTransform: 'none',
													display: 'flex',
													alignItems: 'center',
													gap: 1,
												}}>
												<span
													style={{
														width: 12,
														height: 12,
														borderRadius: '50%',
														backgroundColor: status.color,
													}}
												/>
												{status.title || 'No Status'}
											</Button>
										</li>
									))}
							</ul>
						</Box> */}

						{/* Filter by Priority */}
						{/* <Box>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Priority
							</Typography>
							<ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
								{board.labels
									.filter((label) => label.id.startsWith('l2'))
									.map((priority) => (
										<li key={priority.id} style={{ marginBottom: '8px' }}>
											<Button
												variant={filterByToEdit.priority === priority.id ? 'contained' : 'outlined'}
												onClick={() =>
													setFilterByToEdit((prev) => ({
														...prev,
														priority: priority.id,
													}))
												}
												sx={{
													width: '100%',
													textTransform: 'none',
													display: 'flex',
													alignItems: 'center',
													gap: 1,
												}}>
												<span
													style={{
														width: 12,
														height: 12,
														borderRadius: '50%',
														backgroundColor: priority.color,
													}}
												/>
												{priority.title || 'No Priority'}
											</Button>
										</li>
									))}
							</ul>
						</Box> */}
					</Box>

					{/* Close Button */}
					<Box sx={{ mt: 3, textAlign: 'right' }}>
						<Button onClick={handleClose} size='small' variant='outlined'>
							Close
						</Button>
					</Box>
				</Box>
			</Popover>

			<MuiIconButton className='icon-button'>
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
			</MuiIconButton>
		</MuiStack>
	)
}
