import React, { useEffect, useState } from 'react'
import {
  removeTask,
  setCheckedTasks,
  setFooter,
  updateBoard,
} from '../../store/board/board.actions'
import { TaskPreview } from '../task/TaskPreview'
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { Link } from 'react-router-dom'
import { getSvg } from '../../services/util.service'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { Menu, MenuItem, IconButton } from '@mui/material'
import { boardService } from '../../services/board.service'
import Input from '@mui/joy/Input'

const SvgIcon = ({ iconName, options }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}

export function TaskList({ board, group, cmpTitles, cmpsOrder }) {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [tempTitle, setTempTitle] = useState('')
  const [tasksChecked, setTasksChecked] = useState([])
  const [groupChecked, setGroupChecked] = useState(false)
  const [isIndeterminate, setIsIndeterminate] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  useEffect(() => {
    const allChecked =
      group.tasks.length > 0 && tasksChecked.length === group.tasks.length
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
      prevState.includes(task)
        ? prevState.filter((t) => t !== task)
        : [...prevState, task]
    )
  }

  const handleEdit = (taskId, currentTitle) => {
    setEditingTaskId(taskId)
    setTempTitle(currentTitle)
  }

  const handleSave = (taskId) => {
    if (tempTitle.trim() && tempTitle !== '') {
      updateBoard(board, group.id, taskId, { key: 'title', value: tempTitle })
    }
    handleCancel()
  }

  const handleCancel = () => {
    setEditingTaskId(null)
    setTempTitle('')
  }

  const onAddItem = () => {
    const newTask = { id: utilService.makeId(), title: tempTitle }
    const updatedTasks = [...group.tasks, newTask]

    updateBoard(board, group.id, null, { key: 'tasks', value: updatedTasks })
    setTempTitle('')
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
    // console.log(board, group, task, 'Task deleted')
    handleMenuClose()
    removeTask(board, group, task)
  }

  return (
    <div>
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
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleTaskDeleted(board, group, task)
                    }}
                  >
                    Delete task
                  </MenuItem>
                </Menu>
              </span>

              <tr
                className={`task-row ${
                  tasksChecked.includes(task) ? 'checked' : ''
                }`}
              >
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
                      value={tempTitle}
                      onChange={(event) => setTempTitle(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') handleSave(task.id)
                        if (event.key === 'Escape') handleCancel()
                      }}
                      onBlur={handleCancel}
                      sx={{
                        width: `${tempTitle.length + 1}ch`,
                        minWidth: '2ch',
                      }}
                    />
                  ) : (
                    <span onClick={() => handleEdit(task.id, task.title)}>
                      {task.title}
                    </span>
                  )}

                  <Link to={`task/${task.id}`} className='task-cell open'>
                    <div>
                      <SvgIcon iconName={'task_open_icon'} />
                      <span>Open</span>
                    </div>
                  </Link>
                </td>
                <TaskPreview
                  group={group}
                  board={board}
                  task={task}
                  cmpsOrder={cmpsOrder}
                />
              </tr>
            </React.Fragment>
          ))}
          <tr>
            <td colSpan={cmpTitles.length + 1} className='add-item-row'>
              <td className='checkbox-cell'>
                <Checkbox disabled />
              </td>
              <td>
                <Input
                  type='text'
                  placeholder='+ Add item'
                  value={tempTitle}
                  onChange={(event) => setTempTitle(event.target.value)}
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
  )
}
