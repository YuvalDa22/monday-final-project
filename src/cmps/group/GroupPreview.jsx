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
                                logActivity(group, null, group.style.color, 'groupColorChanged')

                                updateBoard(group.id, null, {
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
            </tfoot>
          </table>
        </div>
      </div>
    </>
  )
}
