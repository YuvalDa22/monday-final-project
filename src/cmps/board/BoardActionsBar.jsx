import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Button, ButtonGroup, IconButton as MuiIconButton, Stack as MuiStack } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { getSvg } from '../../services/util.service'

const SvgIcon = ({ iconName, options, className }) => {
	return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }} className={`svg-icon ${className || ''}`}></i>
}

export function BoardActionsBar({ board, onAddTask, onAddGroup }) {
	function handleAddTask(fromHeader) {
		onAddTask(board.groups[0], 'New Task', fromHeader)
	}

	return (
		<MuiStack direction='row' spacing='15px' className='board-actions-bar'>
			<ButtonGroup variant='contained' className='new-task-buttons'>
				<Button onClick={() => handleAddTask(true)} className='add-task-button'>
					New Task
				</Button>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<Button className='dropdown-button'>
							<SvgIcon className='arrow-icon' iconName='arrow_dropDown' options={{ height: 22, width: 22, color: 'white' }} />
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
								boxShadow: '0 4px 17px 6px rgba(0, 0, 0, 0.1);',
								animationDuration: '400ms',
								animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
								willChange: 'transform, opacity',
								width: '12rem',
							}}
						>
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
								onClick={() => onAddGroup(true)}
							>
								<SvgIcon iconName='boardActionsBar_groupBy' options={{ height: 16, width: 16, color: '#676879' }} />
								<span style={{ paddingBottom: '4px' }}>Add group of tasks</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			</ButtonGroup>

			<MuiIconButton className='icon-button'>
				<SearchOutlinedIcon className='icon' />
				<span>Search</span>
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_person' options={{ height: 22, width: 22 }} />
				<span>Person</span>
			</MuiIconButton>
			<MuiIconButton className='icon-button'>
				<SvgIcon iconName='boardActionsBar_filter' options={{ height: 22, width: 22 }} />
				<span>Filter</span>
			</MuiIconButton>
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
