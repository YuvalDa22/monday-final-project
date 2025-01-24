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
  const SvgIcon = ({ iconName, options, className }) => {
    return (
      <i className={className} dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
    )
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
                    }}
                  >
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
                          }}
                        >
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
                  <th key={`header-${index}`} className='header-cell'>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.tasks.map((task, index) => (
                <React.Fragment key={`task-${task.id}`}>
                  <tr
                    className='task-row'
                    style={{
                      // This line says : if task title is being edited OR task is checked , apply the blue backgrnd
                      // note: we can apply it to a class and move the styling logic to a scss file if we rly want to
                      backgroundColor:
                        editingTaskId === task.id ||
                        checkedTasksList.some(
                          (checkedTask) =>
                            checkedTask.groupId === group.id && checkedTask.taskId === task.id
                        )
                          ? 'rgb(208,228,252)'
                          : '',
                    }}
                  >
                    {' '}
                    <td className={'checkbox-cell'}>
                      <Checkbox
                        checked={checkedTasksList.some(
                          (checkedTask) =>
                            checkedTask.groupId === group.id && checkedTask.taskId === task.id
                        )}
                        onChange={(event) => handleTaskChecked(event, task)}
                      />
                    </td>
                    <td className='testzzz'>
                      <Link
                        to={`task/${task.id}`}
                        className='task-cell-container'
                        style={{ display: editingTaskId === task.id ? 'block' : undefined }} // Input was being annoying because it didn't fit well when its container was flex , so the logic was if input is rendered , make its father not flex , and it fixed the annoying gap
                      >
                        {editingTaskId === task.id ? (
                          <Input
                            className='taskTitleInput'
                            autoFocus
                            type='text'
                            value={existingItemTempTitle}
                            onChange={(event) => setExistingItemTempTitle(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') handleSave(task)
                              if (event.key === 'Escape') handleCancel()
                            }}
                            onClick={(event) => {
                              event.preventDefault() // without this , if we click on the editable text inside <input> we get sent to task details, not good
                            }}
                            onBlur={handleCancel}
                            sx={{
                              width: '100%',
                              marginRight: '15px',
                              minWidth: '2ch',
                              alignContent: 'center',
                              transform: 'translateX(-8px)', // help create the illusion that stuff didnt move when clicking on edit task name
                            }}
                          />
                        ) : (
                          <span
                            onClick={(event) => {
                              // these two ensure that clicking on task name = input (to change task name), and NOT to open task details.
                              event.preventDefault()
                              event.stopPropagation()
                              handleEdit(task.id, task.title)
                            }}
                          >
                            {task.title}
                          </span>
                        )}

                        <div
                          className={`openTaskDetails_container ${
                            editingTaskId === task.id ? 'hide_open' : ''
                          }`}
                        >
                          <SvgIcon iconName={'task_open_icon'} className={'svgOpenIcon'} />
                          <div>Open</div>
                        </div>
                      </Link>
                    </td>
                    <TaskPreview
                      key={`preview-${task.id}`}
                      group={group}
                      board={board}
                      task={task}
                      cmpsOrder={cmpsOrder}
                    />
                  </tr>
                  <tr>
                    <td colSpan={cmpTitles.length + 2}>
                      <div className='task-menu'>
                        <IconButton
                          onClick={(event) => handleMenuClick(event, task)}
                          sx={{
                            borderRadius: 1,
                            padding: '0px 5px',
                            '&:hover': { backgroundColor: '#d8d4e4' },
                          }}
                        >
                          <MoreHorizOutlinedIcon sx={{ width: '15px' }} />
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
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              handleTaskDeleted(board, group, task)
                            }}
                          >
                            Delete task
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              handleTaskDuplicate(board, group, task)
                            }}
                          >
                            Duplicate task
                          </MenuItem>
                        </Menu>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
              <tr>
                <td className='checkbox-cell lastone'>
                  <Checkbox disabled />
                </td>
                <td colSpan={cmpTitles.length + 2} className='add-item-row'>
                  <div className='add-item'>
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
                        width: '100%',
                      }}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
