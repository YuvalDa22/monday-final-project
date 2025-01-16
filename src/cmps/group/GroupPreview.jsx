import React, { useState, useEffect } from 'react'
import { SuggestedActions } from '../SuggestedActions.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Input from '@mui/joy/Input'
import {
	addTask,
	removeTask,
	setCheckedTasks,
	setFooter,
	updateBoard,
} from '../../store/board/board.actions'
import { TaskPreview } from '../task/TaskPreview'
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Link, useParams } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { Menu, MenuItem, IconButton } from '@mui/material'

export function GroupPreview({ board, group, cmpTitles, cmpsOrder }) {
	const [isRotated, setIsRotated] = useState(false)
	const handleClick = () => {
		setIsRotated(!isRotated)
	}
	const SvgIcon = ({ iconName, options }) => {
		return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
	}
	const [editingTaskId, setEditingTaskId] = useState(null)
	const [existingItemTempTitle, setExistingItemTempTitle] = useState('')
	const [newItemTempTitle, setNewItemTempTitle] = useState('')
	const [tasksChecked, setTasksChecked] = useState([])
	const [groupChecked, setGroupChecked] = useState(false)
	const [isIndeterminate, setIsIndeterminate] = useState(false)

	const [anchorEl, setAnchorEl] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)

	useEffect(() => {
		const allChecked = group.tasks.length > 0 && tasksChecked.length === group.tasks.length
		const noneChecked = tasksChecked.length === 0

		setGroupChecked(allChecked)
		setIsIndeterminate(!allChecked && !noneChecked)
		setFooter(tasksChecked.length > 0)
		setCheckedTasks(tasksChecked)
	}, [tasksChecked, group.tasks])

	const handleGroupChecked = (event) => {
		const isChecked = event.target.checked
		setGroupChecked(isChecked)
		setIsIndeterminate(false)

		if (isChecked) {
			setTasksChecked([...group.tasks])
		} else {
			setTasksChecked([])
		}
	}

	const handleTaskChecked = (task) => {
		setTasksChecked((prevState) =>
			prevState.includes(task) ? prevState.filter((t) => t !== task) : [...prevState, task]
		)
	}

	const handleEdit = (taskId, currentTitle) => {
		setEditingTaskId(taskId)
		setExistingItemTempTitle(currentTitle)
	}

	const handleSave = (task) => {
		if (existingItemTempTitle.trim() && existingItemTempTitle !== '') {
			updateBoard(board, group, task, {
				key: 'title',
				value: existingItemTempTitle,
			})
		}
		handleCancel()
	}

	const handleCancel = () => {
		setEditingTaskId(null)
		setNewItemTempTitle('')
		setExistingItemTempTitle('')
	}

	const onAddItem = () => {
		const newTask = { id: utilService.makeId(), title: newItemTempTitle }
		addTask(board, group, newTask)
		setNewItemTempTitle('')
	}

	const handleMenuClick = (event, task) => {
		setAnchorEl(event.currentTarget)
		setSelectedTask(task)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
		setSelectedTask(null)
	}

	const handleTaskDeleted = (board, group, task) => {
		handleMenuClose()
		removeTask(board, group, task)
	}
	useEffect(() => {
		console.log(group.style.color);
		
	}, []);
	return (
		<>
			<div className='gp-main-container'>
				<div className='gh-main-container' 
            style={{ '--group-color': group?.style?.color || '#000' }}>
					<div className='gh-suggested-actions-icon'>
						<SuggestedActions />
					</div>
					<div className='gh-title'>
						<div onClick={handleClick} style={{ cursor: 'pointer' }}>
							{/* TODO: Implement expand/collapse logic to the group */}
							<ExpandMoreIcon
								style={{
									transition: 'transform 0.3s ease',
									transform: isRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
									fontSize: '24px',
									position: 'relative',
                  marginLeft: '12px',
									top: '4',
								}}
							/>
						</div>
						{/* group title - contentEditable TODO - UNDERSTAND IT  */}
						{/*TODO: make it <ContentEditable> */}
						<h2>{group.title}</h2>
						<span className='gh-how-many-tasks'>{group.tasks.length} Tasks</span>
					</div>
				</div>
				<div className='gp-table'>
					<table className='custom-table'>
						<thead>
							<tr>
								<td className='checkbox-cell'>

									<Checkbox checked={groupChecked} onChange={handleGroupChecked} />
								</td>
								<td className='empty-cell'></td>
								{cmpTitles.map((title, index) => (
									<td key={index} className='header-cell'>
										{title}
									</td>
								))}
							</tr>
						</thead>
						<tbody>
							{group.tasks.map((task) => (
								<React.Fragment key={task.id}>
									<span className='task-menu'>
										<IconButton onClick={(event) => handleMenuClick(event, task)}>
											<MoreHorizOutlinedIcon />
										</IconButton>

										<Menu
											anchorEl={anchorEl}
											open={Boolean(anchorEl) && selectedTask?.id === task.id}
											onClose={handleMenuClose}
											anchorOrigin={{
												vertical: 'bottom',
												horizontal: 'right',
											}}
											transformOrigin={{
												vertical: 'top',
												horizontal: 'right',
											}}>
											<MenuItem
												onClick={() => {
													handleTaskDeleted(board, group, task)
												}}>
												Delete task
											</MenuItem>
										</Menu>
									</span>

									<tr className={`task-row ${tasksChecked.includes(task) ? 'checked' : ''}`}>
										<td className='checkbox-cell'>
											<Checkbox
												checked={tasksChecked.includes(task)}
												onChange={() => handleTaskChecked(task)}
											/>
										</td>
										<td className='task-cell'>
											{editingTaskId === task.id ? (
												<Input
													autoFocus
													type='text'
													value={existingItemTempTitle}
													onChange={(event) => setExistingItemTempTitle(event.target.value)}
													onKeyDown={(event) => {
														if (event.key === 'Enter') handleSave(task)
														if (event.key === 'Escape') handleCancel()
													}}
													onBlur={handleCancel}
													sx={{
														width: `${existingItemTempTitle.length + 2.5}ch`,
														minWidth: '2ch',
													}}
												/>
											) : (
												<span onClick={() => handleEdit(task.id, task.title)}>{task.title}</span>
											)}

											<Link to={`task/${task.id}`} className='task-cell open'>
												<div>
													<SvgIcon iconName={'task_open_icon'} />
													<span>Open</span>
												</div>
											</Link>
										</td>
										<TaskPreview group={group} board={board} task={task} cmpsOrder={cmpsOrder} />
									</tr>
								</React.Fragment>
							))}
							<tr>
								<td colSpan={cmpTitles.length + 1} className='add-item-row'>
									<td className='checkbox-cell'>
										<Checkbox disabled sx={{border : 0 , width: '41px'}} />
									</td>
									<td>
										<Input
											type='text'
											placeholder='+ Add item'
											value={newItemTempTitle}
											onChange={(event) => setNewItemTempTitle(event.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter') onAddItem()
												if (event.key === 'Escape') handleCancel()
											}}
											sx={{
												border: 'none',
												outline: 'none',
												background: 'transparent',
											}}
										/>
									</td>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
