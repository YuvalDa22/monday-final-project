import React, { useState, useEffect } from 'react'
import { SuggestedActions } from '../SuggestedActions.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Input from '@mui/joy/Input'
import { addTask, removeTask, updateBoard, duplicateTask } from '../../store/board/board.actions'
import { TaskPreview } from '../task/TaskPreview'
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Link, useParams } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { Menu, MenuItem, IconButton, Box } from '@mui/material'
import { boardService } from '../../services/board.service.js'
import { BlockPicker, CirclePicker } from 'react-color'
import * as Popover from '@radix-ui/react-popover'
export function GroupPreview({
	board,
	group,
	cmpTitles,
	cmpsOrder,
	onTasksCheckedChange,
	checkedTasksList,
	onAddTask,
}) {
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

	const [anchorEl, setAnchorEl] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)
	const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const [groupTempTitle, setGroupTempTitle] = useState(group.title)

	const handleGroupChecked = (event, group) => {
		// if event=null, it means that the callback function that was sent to SuggestedActions was triggered
		if (event?.target.checked) {
			const tasksToAdd = group.tasks.map((task) => ({
				groupId: group.id,
				taskId: task.id,
				groupColor: group.style.color,
			})) // TODO: Add group color
			onTasksCheckedChange(tasksToAdd, 'add')
		} else {
			const tasksToRemove = group.tasks.map((task) => ({ groupId: group.id, taskId: task.id })) // TODO: Add group color
			onTasksCheckedChange(tasksToRemove, 'remove')
		}
	}

	const handleTaskChecked = (event, task) => {
		if (event.target.checked)
			onTasksCheckedChange(
				[
					{
						groupId: group.id,
						taskId: task.id,
						groupColor: group.style.color,
					},
				],
				'add'
			)
		else onTasksCheckedChange([{ groupId: group.id, taskId: task.id }], 'remove')
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

	const handleAddItem = () => {
		onAddTask(group, newItemTempTitle, false)
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
		onTasksCheckedChange([{ groupId: group.id, taskId: task.id }], 'remove')
		removeTask(board, group, task)
	}

	const handleTaskDuplicate = (board, group, task) => {
		handleMenuClose()
		duplicateTask(board, group, task)
	}

	const handleGroupTitleSave = () => {
		if (groupTempTitle.trim() && groupTempTitle !== group.title) {
			updateBoard(null, group, null, {
				key: 'title',
				value: groupTempTitle,
			})
		}
		setIsEditingGroupTitle(false)
		setIsPopoverOpen(false)
	}

	return (
		<>
			<div className='gp-main-container' style={{ '--group-color': group.style.color || '#000' }}>
				<div className='gh-main-container'>
					<div className='gh-title'>
						<SuggestedActions
							board={board}
							group={group}
							updateFooterGroupRemoved={handleGroupChecked}
						/>
						<div className='colored-area'>
							<div onClick={handleClick} className='gh-title-expandMoreIcon'>
								<ExpandMoreIcon
									style={{
										transition: 'transform 0.3s ease',
										transform: isRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
									}}
								/>
							</div>
							<div style={{ position: 'relative' }}>
								{isEditingGroupTitle ? (
									<Box
										sx={{
											display: 'flex',
											alignItems: 'center',
											gap: '8px',
											position: 'relative',
										}}>
										<Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
											<Popover.Trigger asChild>
												<Box className='color-picker-btn' onMouseDown={(e) => e.preventDefault()} />
											</Popover.Trigger>
											<Popover.Portal>
												<Popover.Content
													side='bottom'
													align='start'
													sideOffset={5}
													className='popover-content'
													style={{
														borderRadius: '8px',
														backgroundColor: '#fff',
														boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
													}}>
													<Box className='color-picker-content' sx={{ p: 1, borderRadius: 2 }}>
														<BlockPicker
															colors={Array.from(boardService.groupColors.values())}
															styles={{
																default: {
																	card: {
																		boxShadow: 'none',
																		padding: '0',
																	},
																	head: { display: 'none' },
																	triangle: { display: 'none' },
																	label: { display: 'none' },
																	input: { display: 'none' },
																},
															}}
															onChangeComplete={(color) => {
																updateBoard(board, group, null, {
																	key: 'style',
																	value: { color: color.hex },
																})
																setIsPopoverOpen(false)
																handleGroupTitleSave()
																
															}}
														/>
													</Box>{' '}
												</Popover.Content>
											</Popover.Portal>
										</Popover.Root>
										<Input
											autoFocus
											type='text'
											className='title-input'
											value={groupTempTitle}
											onChange={(e) => setGroupTempTitle(e.target.value)}
											onKeyDown={(e) => {
												if (e.key === 'Enter') handleGroupTitleSave()
												if (e.key === 'Escape') setIsEditingGroupTitle(false)
											}}
											onBlur={() => {
												if (!isPopoverOpen) handleGroupTitleSave()
											}}
											sx={{
												width: `${groupTempTitle.length + 2.5}ch`,
												minWidth: '150px',
											}}
										/>
									</Box>
								) : (
									<h4 onClick={() => setIsEditingGroupTitle(true)}>{group.title || 'New Group'}</h4>
								)}
							</div>
						</div>
						<span className='gh-how-many-tasks'>{group.tasks.length} Tasks</span>
					</div>
				</div>
				<div className='gp-table'>
					<table className='custom-table'>
						<thead>
							<tr className='header-row'>
								<th className='checkbox-cell header'>
									<Checkbox
										checked={
											group.tasks.length > 0 &&
											group.tasks.every((task) =>
												checkedTasksList.some(
													(checkedTask) =>
														checkedTask.groupId === group.id && checkedTask.taskId === task.id
												)
											)
										}
										onChange={(event) => {
											handleGroupChecked(event, group)
										}}
									/>
								</th>
								<th className='task-title'>Task</th>
								{cmpTitles.map((title, index) => (
									<th key={index} className='header-cell'>
										{title}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{group.tasks.map((task) => (
								<React.Fragment key={task.id}>
									<tr>
										<td className='checkbox-cell'>
											<Checkbox
												checked={checkedTasksList.some(
													(checkedTask) =>
														checkedTask.groupId === group.id && checkedTask.taskId === task.id
												)}
												onChange={(event) => handleTaskChecked(event, task)}
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

											<Link to={`task/${task.id}`} className='open'>
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
								<td colSpan={cmpTitles.length + 2} className='add-item-row'>
									<td className='checkbox-cell last'>
										<Checkbox disabled />
									</td>
									<td style={{ border: 'none', boxShadow: 'none' }}>
										<Input
											type='text'
											placeholder='+ Add item'
											value={newItemTempTitle}
											onChange={(event) => setNewItemTempTitle(event.target.value)}
											onKeyDown={(event) => {
												if (event.key === 'Enter') handleAddItem()
												if (event.key === 'Escape') handleCancel()
											}}
											sx={{
												border: 'none',
												outline: 'none',
												background: 'transparent',
												boxShadow: 'none',
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
