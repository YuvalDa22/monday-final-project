import React, { useState, useEffect } from 'react'
import { SuggestedActions } from '../SuggestedActions.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Input from '@mui/joy/Input'
import {
	addTask,
	removeTask,
	updateBoard,
	duplicateTask,
	logActivity,
} from '../../store/board/board.actions'
import GroupTitleEditor from './GroupTitleEditor.jsx'
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Link, useParams } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { Menu, MenuItem, IconButton, Box, Paper, InputBase, Typography } from '@mui/material'
import { boardService } from '../../services/board'
import { BlockPicker, CirclePicker } from 'react-color'
import { DynamicCmp } from '../task/DynamicCmp.jsx'
import * as Popover from '@radix-ui/react-popover'
import { Tooltip } from 'radix-ui'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import GroupItemContainer from './GroupItemContainer.jsx'
import { ProgressBar } from './ProgressBar.jsx'

export function GroupPreview({
	board,
	group,
	cmpTitles,
	cmpsOrder,
	onTasksCheckedChange,
	checkedTasksList,
	onAddTask,
}) {
	const SvgIcon = ({ iconName, options, className }) => {
		return (
			<i className={className} dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
		)
	}
	const [isCollapsed, setIsCollapsed] = useState(false)
	const [editingTaskId, setEditingTaskId] = useState(null)
	const [existingItemTempTitle, setExistingItemTempTitle] = useState('')
	const [newItemTempTitle, setNewItemTempTitle] = useState('')

	const [anchorEl, setAnchorEl] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)
	const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)
	const [groupTempTitle, setGroupTempTitle] = useState(group.title)
	// this is to count stuff for the progress bar
	const counts = group.tasks.reduce((acc, task) => {
		cmpTitles.forEach((title) => {
			const key = title.toLowerCase().replace(/\s+/g, '') // Convert to lowercase & remove spaces

			if (key in task) {
				acc[title] = acc[title] || {} // Ensure the property exists in acc

				if (Array.isArray(task[key])) {
					// If it's an array (like 'memberIds'), count each element separately
					task[key].forEach((item) => {
						acc[title][item] = (acc[title][item] || 0) + 1
					})
				} else {
					// Normal case (single value)
					acc[title][task[key]] = (acc[title][task[key]] || 0) + 1
				}
			}
		})
		return acc
	}, {})
	Object.keys(counts).forEach((category) => {
		// This is to sort the progbar by keys , meaning show l100/l200/ first , and then l101/l202 , etc etc (ascending)
		counts[category] = Object.fromEntries(
			Object.entries(counts[category]).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
		)
	})

	const handleCollapseGroupClicked = () => {
		setIsCollapsed(!isCollapsed)
		group.collapsed = !group.collapsed
	}

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
			const tasksToRemove = group.tasks.map((task) => ({
				groupId: group.id,
				taskId: task.id,
			})) // TODO: Add group color
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
			// logActivity(group, task, task.title, 'taskNameChanged')
			updateBoard(
				group.id,
				task.id,
				{
					key: 'title',
					value: existingItemTempTitle,
				},
				{ action: 'taskNameChanged' }
			)
		}
		handleCancel()
	}

	const handleCancel = () => {
		setEditingTaskId(null)
		setNewItemTempTitle('')
		setExistingItemTempTitle('')
	}

	const handleAddItem = () => {
		if (!newItemTempTitle.trim()) {
			// if the title is empty, add a default title
			onAddTask(group, 'New Task', false)
		} else {
			onAddTask(group, newItemTempTitle, false)
		}
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
			// logActivity(group, null, group.title, {
			//   action: 'groupNameChanged',
			//   message: 'Group Name Changed',
			//   free_txt: `To '${groupTempTitle}'`,
			// })
			updateBoard(
				group.id,
				null,
				{
					key: 'title',
					value: groupTempTitle,
				},
				{ action: 'groupNameChanged' }
			)
		} else setGroupTempTitle(group.title) // sync the state with actual group title incase first if failed
		setIsEditingGroupTitle(false)
		setIsPopoverOpen(false) // what is this
	}

	const { setNodeRef: setGroupRef } = useDroppable({
		id: group.id,
	})

	if (isCollapsed) return (
		<div
			className='gp-main-container'
			style={{ '--group-color': group.style.color || '#000', left: '40px' }}>
			{/* {isCollapsed ? ( */}
				<div className='collapsed-gp'>
          <div style={{ marginTop: '5px', justifySelf: 'center' }}>
					<SuggestedActions
						board={board}
						group={group}
						updateFooterGroupRemoved={handleGroupChecked}
					/>
          </div>
					<div className='gp-table'>
						<table className='custom-table'>
							<tr className='header-row'>
								<td className='task-title gp-collapsed-header-td'>
									<div className='colored-area collapsed'>
										<div onClick={handleCollapseGroupClicked} className='gh-title-expandMoreIcon'>
											<ExpandMoreIcon
												style={{
													transition: 'transform 0.3s ease',
													transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
												}}
											/>
										</div>
											{isEditingGroupTitle ? (
												<GroupTitleEditor
                        group={group}
                        isCollapsed={isCollapsed}
                        updateBoard={updateBoard}
                        onSave={() => setIsEditingGroupTitle(false)}
                    />
											) : (
												<h4 onClick={() => setIsEditingGroupTitle(true)} className='group-title'>
													{group.title ? group.title : 'New Group'}{' '}
												</h4>
											)}
											<span style={{ color: 'gray', fontSize: '14px'  }}>
												{group.tasks.length > 1
													? `${group.tasks.length} Tasks`
													: `${group.tasks.length} Task`}
											</span>
									</div>
								</td>
                {cmpTitles.map((label, index) => (
										<ProgressBar
											key={label + index}
                      index={index}
											counts={counts}
											label={label}
											board={board}
											isCollapsed={isCollapsed}
										/>
									))}

								<td className='end-cell'></td>
							</tr>
						</table>
					</div>
				</div>
			</div>
      ) 
  else return (  
      <div
			className='gp-main-container'
			style={{ '--group-color': group.style.color || '#000', left: '40px' }}>
					<div className='gh-main-container'>
						<div className='gh-title'>
							<SuggestedActions
								board={board}
								group={group}
								updateFooterGroupRemoved={handleGroupChecked}
							/>
							<div className='colored-area'>
								<div onClick={handleCollapseGroupClicked} className='gh-title-expandMoreIcon'>
									<ExpandMoreIcon
										style={{
											transition: 'transform 0.3s ease',
											transform: 'rotate(0deg)',
										}}
									/>
								</div>
									{isEditingGroupTitle ? (
									<GroupTitleEditor
                  group={group}
                  isCollapsed={isCollapsed}
                  updateBoard={updateBoard}
                  onSave={() => setIsEditingGroupTitle(false)}
              />
									) : (
										<h4 onClick={() => setIsEditingGroupTitle(true)} className='group-title'>
											{group.title ? group.title : 'New Group'}
										</h4>
									)}
							</div>
							<span className='gh-how-many-tasks'>
												{group.tasks.length > 1
													? `${group.tasks.length} Tasks`
													: `${group.tasks.length} Task`}
											</span>
						</div>
					</div>
					<div className='gp-table'>
						<table className='custom-table'>
							<thead>
								<tr className='header-row'>
									<th className='checkbox-cell header'>
										<Checkbox
											size='small'
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
										<th key={`header-${index}`} className='header-cell'>
											{title}
										</th>
									))}
									<th className='end-cell'></th>
								</tr>
							</thead>
							<SortableContext
								id={group.id}
								items={group.tasks.map((task) => task.id)}
								strategy={verticalListSortingStrategy}>              </SortableContext> 
                {/* Look if the Sortable Context is needed here or at the end of the tBody */}

							<tbody ref={setGroupRef} style={{ position: 'relative' }}>
								{group.tasks.map((task, index) => (
										<GroupItemContainer
											key={`task-${task.id}`}
											item={task}
											group={group}
											board={board}
											cmpsOrder={cmpsOrder}
											editingTaskId={editingTaskId}
											setExistingItemTempTitle={setExistingItemTempTitle}
											existingItemTempTitle={existingItemTempTitle}
											handleEdit={handleEdit}
											handleSave={handleSave}
											handleCancel={handleCancel}
											checkedTasksList={checkedTasksList}
											handleTaskChecked={handleTaskChecked}
											anchorEl={anchorEl}
											selectedTask={selectedTask}
											handleMenuClick={handleMenuClick}
											handleMenuClose={handleMenuClose}
											handleTaskDeleted={handleTaskDeleted}
											handleTaskDuplicate={handleTaskDuplicate}
										/>
									))}
							</tbody>
							<tfoot>
								<tr>
									<td className='checkbox-cell lastone'>
										<Checkbox size='small' disabled />
									</td>
									<td colSpan={cmpTitles.length + 2} className='add-item-row'>
										<div className='add-item'>
											<Input
												className='input'
												type='text'
												placeholder='+ Add task'
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
													width: '100%',
												}}
											/>
										</div>
									</td>
								</tr>
								<tr>
									<td colSpan='2' style={{ border: 'none' }}></td>
									{/*Skip first 2 columns (checkbox+Task) */}
                  {cmpTitles.map((label, index) => (
										<ProgressBar
											key={label + index}
                      index={index}
											counts={counts}
											label={label}
											board={board}
											isCollapsed={isCollapsed}
										/>
									))}
								</tr>
							</tfoot>
						</table>
					</div>
				</div>
	)
}
