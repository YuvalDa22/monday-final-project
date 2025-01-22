import { useRef, useState } from 'react'
import { IconButton as MuiIconButton, Stack as MuiStack } from '@mui/material'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

// import {
// 	Box,
// 	Group,
// 	IconButton as ChakraIconButton,
// 	MenuContent,
// 	MenuItem,
// 	MenuRoot,
// 	MenuTrigger,
// 	Button as ChakraButton
// } from '@chakra-ui/react'

// import { LuChevronDown } from 'react-icons/lu'
import { getSvg } from '../../services/util.service'


const SvgIcon = ({ iconName, options }) => {
	return (
		<i
			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
			style={{ display: 'flex', opacity: 0.6 }}></i>
	)
}

export function BoardActionsBar({ board, onAddTask, onAddGroup }) {
	function handleAddTask(fromHeader) {
		onAddTask(board.groups[0], 'New Task', fromHeader)
	}

	const customButtonsStyles = {
        borderRadius: '8px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
		outline: 'none',
        fontFamily: 'figtree, sans-serif', 
        color: 'white',
        backgroundColor: '#0073ea', 
        transition: 'all 0.2s ease',
        _hover: {
            zIndex: 11,
            backgroundColor: '#0060b9',
            boxShadow: 'none',
        },
    };


	return (
		<MuiStack direction='row' spacing='15px' style={{ alignItems: 'center' }}>
			{/* <Group css={customButtonsStyles}attached borderRadius='sm'>
				<ChakraButton style={{ borderRightColor: '#0060b9' , padding: '4px 8px'}} css={customButtonsStyles} size='sm' onClick={() => handleAddTask(true)}>
				New Task
				</ChakraButton>
				<Box position='relative' outline='none'>
					<MenuRoot positioning={{ placement: 'bottom-start' }}>
						<MenuTrigger asChild>
							<ChakraIconButton size='sm' style={{borderBottomLeftRadius: 0 , borderTopLeftRadius: 0, color: 'white'}} css={customButtonsStyles} >
								<LuChevronDown  />
							</ChakraIconButton>
						</MenuTrigger>
						<MenuContent style={{ zIndex: 999, position: 'absolute' }}>
							<MenuItem value='new-group' onClick={() => onAddGroup(true)}>
								New Group of Tasks
							</MenuItem>
						</MenuContent>
					</MenuRoot>
				</Box>
			</Group> */}

			<MuiIconButton
				sx={{
					borderRadius: '5px',
					fontSize: '15px',
					gap: 0.5,
					opacity: 1,
				}}>
				<SearchOutlinedIcon style={{ opacity: 1, height: 22, width: 22 }} />
				Search
			</MuiIconButton>
			<MuiIconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName='boardActionsBar_person' options={{ height: 22, width: 22 }} />
				Person
			</MuiIconButton>
			<MuiIconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName='boardActionsBar_filter' options={{ height: 22, width: 22 }} />
				Filter
			</MuiIconButton>
			<MuiIconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName='boardActionsBar_sort' options={{ height: 22, width: 22 }} />
				Sort
			</MuiIconButton>
			<MuiIconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName='boardActionsBar_hide' options={{ height: 22, width: 22 }} />
				Hide
			</MuiIconButton>
			<MuiIconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
				<SvgIcon iconName='boardActionsBar_groupBy' options={{ height: 17, width: 17 }} />
				Group by
			</MuiIconButton>
		</MuiStack>
	)
}

// import { useRef, useState } from 'react';
// import {
// 	Button as MuiButton,
// 	ButtonGroup as MuiButtonGroup,
// 	ClickAwayListener,
// 	colors,
// 	Grow,
// 	IconButton as MuiIconButton,
// 	MenuItem as MuiMenuItem,
// 	MenuList as MuiMenuList,
// 	Paper,
// 	Popper,
// 	Stack as MuiStack,
// } from '@mui/material';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

// import {
// 	Box as Box,
// 	Group as Group,
// 	IconButton as ChakraIconButton,
// 	MenuContent as MenuContent,
// 	MenuItem as MenuItem,
// 	MenuRoot as MenuRoot,
// 	MenuTrigger as MenuTrigger,
// } from '@chakra-ui/react';
// import { Button as ChakraButton } from '../ui/button';

// import { LuChevronDown } from 'react-icons/lu';

// import { getSvg } from '../../services/util.service';
// import zIndex from '@mui/material/styles/zIndex';

// const SvgIcon = ({ iconName, options }) => {
// 	return (
// 		<i
// 			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
// 			style={{ display: 'flex', opacity: 0.6 }}></i>
// 	)
// }

// export function BoardActionsBar({ board, onAddTask, onAddGroup }) {
// 	const [anchorEl, setAnchorEl] = useState(null)
// 	const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
// 	const handleMenuClose = () => setAnchorEl(null)
// 	const anchorRef = useRef(null)

// 	function handleAddTask(fromHeader) {
// 		onAddTask(board.groups[0], 'New Task', fromHeader)
// 	}

// 	return (
// 		<Stack direction={'row'} spacing={'15px'} style={{ alignItems: 'center' }}>
// 			<Group attached>
// 				<Button variant='outline' size='sm'>
// 					Button
// 				</Button>
// 				<Box position='relative'>
// 					<MenuRoot positioning={{ placement: 'bottom-start' }}>
// 						<MenuTrigger asChild>
// 							<IconButton variant='outline' size='sm'>
// 								<LuChevronDown />
// 							</IconButton>
// 						</MenuTrigger>
// 						<MenuContent style={{ zIndex: 999, position: 'absolute' }}>
// 							<MenuItem value='new-group'>New Text File</MenuItem>
// 						</MenuContent>
// 					</MenuRoot>
// 				</Box>
// 			</Group>

// 			{/* <ButtonGroup
// 				variant='contained'
// 				ref={anchorRef}
// 				className='new-task-buttons'
// 				>
// 				<Button
// 					className='new-task-button'
// 					onClick={() => handleAddTask(true)}
// 				>
// 					New task
// 				</Button>
// 				<Button
// 					size='small'
// 					onClick={handleMenuOpen}
// 					className='new-task-button-arrow'>
// 					<SvgIcon iconName={'arrow_dropDown'} options={{color: 'white'}}/>
// 				</Button>
// 			</ButtonGroup>
// 			<Popper
// 				sx={{ zIndex: 1 }}
// 				open={Boolean(anchorEl)}
// 				anchorEl={anchorEl}
// 				transition
// 				placement='bottom-start'
// 				onClose={handleMenuClose}>
// 				{({ TransitionProps }) => (
// 					<Grow
// 						{...TransitionProps}>
// 						<Paper>
// 							<ClickAwayListener
// 								anchorEl={anchorEl}
// 								onClickAway={handleMenuClose}>
// 								<MenuList id='split-button-menu' autoFocusItem onClose={handleMenuClose}>
// 									<MenuItem onClick={() => onAddGroup(true)}>New Group of Tasks</MenuItem>
// 								</MenuList>
// 							</ClickAwayListener>
// 						</Paper>
// 					</Grow>
// 				)}
// 			</Popper> */}
// 			<IconButton
// 				sx={{
// 					borderRadius: '5px',
// 					fontSize: '15px',
// 					gap: 0.5,
// 					opacity: 1,
// 				}}
// 				>
// 				<SearchOutlinedIcon style={{ opacity: 1, height: 22, width: 22 }} />
// 				Search
// 			</IconButton>
// 			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
// 				<SvgIcon iconName={'boardActionsBar_person'} options={{ height: 22, width: 22 }} />
// 				Person
// 			</IconButton>
// 			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
// 				<SvgIcon iconName={'boardActionsBar_filter'} options={{ height: 22, width: 22 }} />
// 				Filter
// 			</IconButton>
// 			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
// 				<SvgIcon iconName={'boardActionsBar_sort'} options={{ height: 22, width: 22 }} />
// 				Sort
// 			</IconButton>
// 			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
// 				<SvgIcon iconName={'boardActionsBar_hide'} options={{ height: 22, width: 22 }} />
// 				Hide
// 			</IconButton>
// 			<IconButton sx={{ borderRadius: '5px', fontSize: '15px', gap: 1 }}>
// 				<SvgIcon iconName={'boardActionsBar_groupBy'} options={{ height: 17, width: 17 }} />
// 				Group by
// 			</IconButton>
// 		</Stack>
// 	)
// }
