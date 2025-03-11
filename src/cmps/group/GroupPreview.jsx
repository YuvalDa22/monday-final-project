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
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Link, useParams } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import { Menu, MenuItem, IconButton, Box, Paper, InputBase } from '@mui/material'
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
  const [isCollapsed, setIsCollapsed] = useState(group.collapsed)
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

  // console.log(Checkbox)

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
      logActivity(group, task, task.title, 'taskNameChanged')
      updateBoard(group.id, task.id, {
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
      logActivity(group, null, group.title, {
        action: 'groupNameChanged',
        message: 'Group Name Changed',
        free_txt: `To '${groupTempTitle}'`,
      })
      updateBoard(group.id, null, {
        key: 'title',
        value: groupTempTitle,
      })
    } else setGroupTempTitle(group.title) // sync the state with actual group title incase first if failed
    setIsEditingGroupTitle(false)
    setIsPopoverOpen(false) // what is this
  }

  const { setNodeRef: setGroupRef } = useDroppable({
    id: group.id,
  })

  return (
    <>
      <div
        className='gp-main-container'
        style={{
          '--group-color': group.style.color || '#000',
          color: group.collapsed ? 'gray' : '',
          opacity: group.collapsed ? '0.8' : '1',
        }}
      >
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
                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                  }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                {isEditingGroupTitle ? (
                  <Paper
                    component='form'
                    className='gh-title-input-container flex align-center input'
                  >
                    {' '}
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
                                logActivity(group, null, group.style.color, 'groupColorChanged')

                                updateBoard(group.id, null, {
                                  key: 'style',
                                  value: { color: color.hex },
                                })
                                setIsPopoverOpen(false)
                                handleGroupTitleSave()
                              }}
                            />
                          </Box>
                        </Popover.Content>
                      </Popover.Portal>
                    </Popover.Root>
                    <InputBase
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
                  </Paper>
                ) : (
                  <h4 onClick={() => setIsEditingGroupTitle(true)}>
                    {group.title ? group.title : 'New Group'}{' '}
                    <span style={{ color: 'gray', marginLeft: '10px' }}>
                      {isCollapsed ? `${group.tasks.length} Tasks [Collapsed]` : ''}
                    </span>
                  </h4>
                )}
              </div>
            </div>
            {!isCollapsed && <span className='gh-how-many-tasks'>{group.tasks.length} Tasks</span>}
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
              </tr>
            </thead>
            <SortableContext
              id={group.id}
              items={group.tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody ref={setGroupRef} style={{ position: 'relative' }}>
                {!isCollapsed &&
                  group.tasks.map((task, index) => (
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
            </SortableContext>
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
                {cmpTitles.map((label, index) => {
                  const totalAmountOfTasksWithStatus = Object.values(counts[label] || {}).reduce(
                    (sum, value) => sum + value,
                    0
                  ) // Calculate total for the label
                  return (
                    <td
                      key={label + index}
                      className={`groupPreview_ProgressBar_container ${index == 0 ? 'first' : ''}`}
                    >
                      {/* Apply special style to the first progbar td*/}
                      <div className='ProgressBar_colors_container'>
                        {Object.entries(counts[label] || {}).map(([key, value]) => (
                          <Tooltip.Provider key={key}>
                            <Tooltip.Root delayDuration={300} skipDelayDuration={0}>
                              <Tooltip.Trigger asChild>
                                <div
                                  className='ProgressBar_single_color'
                                  style={{
                                    backgroundColor: board.labels.find((label) => label.id === key)
                                      ?.color,
                                    width: `${(value / totalAmountOfTasksWithStatus) * 100}%`,
                                  }}
                                ></div>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content className='TooltipContent' sideOffset={8}>
                                  {`${
                                    board.labels.find((label) => label.id === key).title
                                  } ${value}/${totalAmountOfTasksWithStatus} \u00A0 ${
                                    ((value / totalAmountOfTasksWithStatus) * 100) % 1 === 0
                                      ? (value / totalAmountOfTasksWithStatus) * 100 // if division is clean simply show the number but if not show 1 digit after the dot
                                      : ((value / totalAmountOfTasksWithStatus) * 100).toFixed(1)
                                  }%`}

                                  <Tooltip.Arrow className='TooltipArrow' />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                          </Tooltip.Provider>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}



