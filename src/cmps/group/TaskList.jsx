import Input from '@mui/joy/Input'
import { useEffect, useState } from 'react'
import {
  setCheckedTasks,
  setFooter,
  updateBoard,
} from '../../store/board/board.actions'
import { TaskPreview } from '../task/TaskPreview'
import { utilService } from '../../services/util.service'
import Checkbox from '@mui/material/Checkbox'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { Link, useParams } from 'react-router-dom'

export function TaskList({ board, group, cmpTitles, cmpsOrder }) {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [tempTitle, setTempTitle] = useState('')
  const [tasksChecked, setTasksChecked] = useState([])
  const [groupChecked, setGroupChecked] = useState(false)
  const [isIndeterminate, setIsIndeterminate] = useState(false)

  useEffect(() => {
    const allChecked =
      group.tasks.length > 0 && tasksChecked.length === group.tasks.length
    const noneChecked = tasksChecked.length === 0

    setGroupChecked(allChecked)
    !allChecked && !noneChecked
    setFooter(tasksChecked.length > 0)
    setCheckedTasks(tasksChecked)
  }, [tasksChecked, group.tasks])

  const handleGroupChecked = (event) => {
    const isChecked = event.target.checked
    setGroupChecked(isChecked)
    setIsIndeterminate(false) // Reset the indeterminate state

    if (isChecked) {
      setTasksChecked([...group.tasks])
    } else {
      setTasksChecked([])
    }
  }

  const handleTaskChecked = (task) => {
    setTasksChecked(
      (prevState) =>
        prevState.includes(task)
          ? prevState.filter((t) => t !== task) // Remove task (uncheck)
          : [...prevState, task] // Add task (check)
    )
  }

  const handleEdit = (taskId, currentTitle) => {
    setEditingTaskId(taskId)
    setTempTitle(currentTitle) // Optimistic UI change
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

  return (
    <div>
      <table className='custom-table'>
        <thead>
          <tr>
            <td className='checkbox-cell'>
              <Checkbox
                checked={groupChecked} // Controlled by `groupChecked`
                onChange={handleGroupChecked} // Toggles all tasks
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
            <tr
              key={task.id}
              className={`task-row ${
                tasksChecked.includes(task) ? 'checked' : ''
              }`}
            >
              <td className='checkbox-cell'>
                <Checkbox
                  checked={tasksChecked.includes(task)} // Controlled by `tasksChecked`
                  onChange={() => handleTaskChecked(task)} // Toggles the task
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
                    onBlur={() => {
                      handleCancel()
                    }}
                  />
                ) : (
                  <span onClick={() => handleEdit(task.id, task.title)}>
                    {task.title}
                  </span>
                )}
                <div className='task-cell open'>
                  <Link to={`task/${task.id}`}>
                    <OpenInFullOutlinedIcon
                      sx={{
                        width: '16px',
                      }}
                    />
                    <span>Open</span>
                  </Link>
                </div>
              </td>
              <TaskPreview
                group={group}
                board={board}
                task={task}
                cmpsOrder={cmpsOrder}
              />
            </tr>
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
