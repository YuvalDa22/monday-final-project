import React, { useState, useEffect } from 'react'
import { SuggestedActions } from '../SuggestedActions.jsx'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Input from '@mui/joy/Input'
import {
  addTask,
  removeTask,
  updateBoard,
  duplicateTask,
} from '../../store/board/board.actions'
import { TaskPreview } from '../task/TaskPreview'
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Link, useParams } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { Menu, MenuItem, IconButton } from '@mui/material'

export function GroupPreview({ board, group, cmpTitles, cmpsOrder,onTasksCheckedChange, checkedTasksList, onAddTask }) {
  const [isRotated, setIsRotated] = useState(false)
  const handleClick = () => {
    setIsRotated(!isRotated)
  }
  const SvgIcon = ({ iconName, options }) => {
    return (
      <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
    )
  }
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [existingItemTempTitle, setExistingItemTempTitle] = useState('')
  const [newItemTempTitle, setNewItemTempTitle] = useState('')

	const [anchorEl, setAnchorEl] = useState(null)
	const [selectedTask, setSelectedTask] = useState(null)
	const [isEditingGroupTitle, setIsEditingGroupTitle] = useState(false)
	const [groupTempTitle, setGroupTempTitle] = useState(group.title)

  const handleGroupChecked = (event,group) => {
    // if event=null, it means that the callback function that was sent to SuggestedActions was triggered
    if (event?.target.checked)
    { 
      const tasksToAdd = group.tasks.map((task) => ({groupId: group.id, taskId: task.id })) // TODO: Add group color 
      onTasksCheckedChange(tasksToAdd,'add')
    }
    else
    {
      const tasksToRemove = group.tasks.map((task) => ({groupId: group.id, taskId: task.id })) // TODO: Add group color 
      onTasksCheckedChange(tasksToRemove,'remove')
    }

  }

  const handleTaskChecked = (event,task)=>{
    if (event.target.checked)
      onTasksCheckedChange([{groupId: group.id, taskId: task.id }],'add')
    else
    onTasksCheckedChange([{groupId: group.id, taskId: task.id }],'remove')
    


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
    onTasksCheckedChange([{groupId: group.id, taskId: task.id }],'remove')
    removeTask(board, group, task)
  }

	const handleTaskDuplicate = (board, group, task) => {
		handleMenuClose()
		duplicateTask(board, group, task)
	}

	const handleGroupTitleSave = () => {
		if (groupTempTitle.trim() && groupTempTitle !== group.title) {
			updateBoard(board, group, null, {
				key: 'title',
				value: groupTempTitle,
			})
		} else setGroupTempTitle(group.title) // sync the state with actual group title incase first if failed
		setIsEditingGroupTitle(false)
	}

  return (
    <>
      <div className='gp-main-container' style={{ alignItems: 'baseline' }}>
        <div
          className='gh-main-container'
          style={{
            alignItems: 'baseline',
            '--group-color': group?.style?.color || '#000',
          }}
        >
          <div className='gh-title'>
            <SuggestedActions board={board} group={group} updateFooterGroupRemoved={handleGroupChecked}/>
            <div
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
              className='gh-title-expandMoreIcon'
            >
              <ExpandMoreIcon
                style={{
                  transition: 'transform 0.3s ease',
                  transform: isRotated ? 'rotate(-90deg)' : 'rotate(0deg)',
                }}
              />
            </div>
            {isEditingGroupTitle ? (
              <Input
                autoFocus
                type='text'
                value={groupTempTitle}
                onChange={(event) => setGroupTempTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleGroupTitleSave()
                  if (event.key === 'Escape') setIsEditingGroupTitle(false)
                }}
                onBlur={handleGroupTitleSave}
                sx={{
                  width: `${groupTempTitle.length + 2.5}ch`,
                  minWidth: '2ch',
                }}
              />
            ) : (
              <h3 onClick={() => setIsEditingGroupTitle(true)}>
                {group.title || 'New Group'}
              </h3>
            )}
            <span className='gh-how-many-tasks'>
              {group.tasks.length} Tasks
            </span>
          </div>
        </div>
        <div className='gp-table'>
          <table className='custom-table'>
            <thead>
              <tr>
                <td className='checkbox-cell'>
                  <Checkbox
                  checked={group.tasks.length>0 && group.tasks.every(task =>
                    checkedTasksList.some(checkedTask =>
                      checkedTask.groupId === group.id && checkedTask.taskId === task.id
                    )
                  )}
                   onChange={(event) => {handleGroupChecked(event,group)}}
                  />
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
                    <IconButton
                      onClick={(event) => handleMenuClick(event, task)}
                    >
                      <MoreHorizOutlinedIcon sx={{ width: '20px' }} />
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
											<MenuItem
												onClick={() => {
													handleTaskDuplicate(board, group, task)
												}}>
												Duplicate task
											</MenuItem>
										</Menu>
									</span>

                  <tr                  >
                    <td className='checkbox-cell'>
                      <Checkbox
                         checked={checkedTasksList.some(checkedTask =>
                             checkedTask.groupId === group.id && checkedTask.taskId === task.id
                           )}
                         onChange={(event) => handleTaskChecked(event,task)}
                      />
                    </td>
                    <td className='task-cell'>
                      {editingTaskId === task.id ? (
                        <Input
                          autoFocus
                          type='text'
                          value={existingItemTempTitle}
                          onChange={(event) =>
                            setExistingItemTempTitle(event.target.value)
                          }
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
                        <span onClick={() => handleEdit(task.id, task.title)}>
                          {task.title}
                        </span>
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
								<td colSpan={cmpTitles.length + 1} className='add-item-row'>
									<td className='checkbox-cell'>
										<Checkbox size='small' disabled />
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
