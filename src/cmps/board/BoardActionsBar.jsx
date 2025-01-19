import { useRef, useState } from 'react'
import {
	Button,
	ButtonGroup,
	ClickAwayListener,
	colors,
	Grow,
	IconButton,
	MenuItem,
	MenuList,
	Paper,
	Popper,
} from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Stack from '@mui/material/Stack'

import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options }) => {
	return (
		<i
			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
			style={{ display: 'flex', opacity: 0.6 }}></i>
	)
}

export function BoardActionsBar({board, onAddTask, onAddGroup}) {
	const [anchorEl, setAnchorEl] = useState(null)
	const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
	const handleMenuClose = () => setAnchorEl(null)
	const anchorRef = useRef(null)

	function handleAddTask(fromHeader) {
		onAddTask(board.groups[0], 'New Task', fromHeader)
	}

	return (
		<Stack direction={'row'} spacing={'15px'} style={{ alignItems: 'center' }}>
			<ButtonGroup 
				variant='contained' 
				ref={anchorRef} 
				className='new-task-buttons'
				>
				<Button
					className='new-task-button'
					onClick={() => handleAddTask(true)}
				>
					New task
				</Button>
				<Button
					size='small'
					onClick={handleMenuOpen}
					className='new-task-button-arrow'>
					<SvgIcon iconName={'arrow_dropDown'} options={{color: 'white'}}/>
				</Button>
			</ButtonGroup>
			<Popper
				sx={{ zIndex: 1 }}
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				transition
				placement='bottom-start'
				onClose={handleMenuClose}>
				{({ TransitionProps }) => (
					<Grow
						{...TransitionProps}>
						<Paper>
							<ClickAwayListener
								anchorEl={anchorEl}
								onClickAway={handleMenuClose}>
								<MenuList id='split-button-menu' autoFocusItem onClose={handleMenuClose}>
									<MenuItem onClick={() => onAddGroup(true)}>New Group of Tasks</MenuItem>
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
			<IconButton
				sx={{
					borderRadius: '5px',
					fontSize: '15px',
					gap: 0.5,
					opacity: 1,
				}}>
				<SearchOutlinedIcon style={{ opacity: 1, height: 22, width: 22 }} />
				Search
			</IconButton>
			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName={'boardActionsBar_person'} options={{ height: 22, width: 22 }} />
				Person
			</IconButton>
			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName={'boardActionsBar_filter'} options={{ height: 22, width: 22 }} />
				Filter
			</IconButton>
			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName={'boardActionsBar_sort'} options={{ height: 22, width: 22 }} />
				Sort
			</IconButton>
			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName={'boardActionsBar_hide'} options={{ height: 22, width: 22 }} />
				Hide
			</IconButton>
			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName={'boardActionsBar_groupBy'} options={{ height: 17, width: 17 }} />
				Group by
			</IconButton>
		</Stack>
	)
}
