import Input from '@mui/joy/Input'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { updateBoard } from '../../store/board/board.actions'
import { TaskPreview } from '../task/TaskPreview'
import { utilService } from '../../services/util.service'

export function TaskList({ board, group, cmpTitles, cmpsOrder }) {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [tempTitle, setTempTitle] = useState('')

  const handleEdit = (taskId, currentTitle) => {
    setEditingTaskId(taskId)
    setTempTitle(currentTitle) //optimistic UI change
  }

  //save updated task name
  const handleSave = (taskId) => {
    if (tempTitle.trim() && tempTitle !== '') {
      //TODO - check functionality
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
            <tr key={task._id}>
              <td className='task-cell'>
                {editingTaskId === task.id ? (
                  <Input
                    type='text'
                    value={tempTitle}
                    onChange={(event) => setTempTitle(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') handleSave(task.id)
                      if (event.key === 'Escape') handleCancel()
                    }}
                  />
                ) : (
                  <span onClick={() => handleEdit(task.id, task.title)}>
                    <Link to={`task/${task.id}`}>{task.title}</Link>
                  </span>
                )}
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

{
  /* last tr - group summary */
}
{
  /* TODO - IMPLEMENT SUMMARY */
}
{
  /* <GroupSummary group={group} /> */
}
