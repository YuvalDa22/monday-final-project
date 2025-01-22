import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button, ButtonGroup, IconButton as MuiIconButton, Stack as MuiStack } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options }) => {
	return (
		<i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }} className='svg-icon'></i>
	)
}

export function BoardActionsBar({ board, onAddTask, onAddGroup }) {
	function handleAddTask(fromHeader) {
		onAddTask(board.groups[0], 'New Task', fromHeader)
	}

	return (
		<MuiStack direction='row' spacing='15px' className='board-actions-bar'>
			<ButtonGroup variant='contained' className='new-task-buttons'>
				{/* Button to add a new task */}
				<Button onClick={() => handleAddTask(true)} className='add-task-button'>
					New Task
				</Button>

				{/* Dropdown Menu for more options */}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<Button className='dropdown-button'>
							<SvgIcon
								iconName='arrow_dropDown'
								options={{ height: 22, width: 22, color: 'white' }}
							/>
						</Button>
					</DropdownMenu.Trigger>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							side='bottom' 
							align='start' 
							sideOffset={5}
							style={{
								backgroundColor: 'white',
								border: '1px solid #ccc',
								borderRadius: '5px',
								padding: '8px',
								boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
								animationDuration: '400ms',
								animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
								willChange: 'transform, opacity',
							}}>
							
							<DropdownMenu.Item
								style={{
									fontSize: '13px',
									lineHeight: 1,
									color: '#6b7280',
									borderRadius: '3px',
									display: 'flex',
									alignItems: 'center',
									height: '25px',
									padding: '0 5px',
									cursor: 'pointer',
								}}
								onMouseEnter={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
								onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
								onClick={() => onAddGroup(true)}>
								Add Group of Tasks
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</ButtonGroup>

			{/* Other Actions */}
			<MuiIconButton className='icon-button'>
				<SearchOutlinedIcon className='icon' />
				Search
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_person' options={{ height: 22, width: 22 }} />
				Person
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_filter' options={{ height: 22, width: 22 }} />
				Filter
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_sort' options={{ height: 22, width: 22 }} />
				Sort
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_hide' options={{ height: 22, width: 22 }} />
				Hide
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_groupBy' options={{ height: 17, width: 17 }} />
				Group by
			</MuiIconButton>
		</MuiStack>
	)
}
