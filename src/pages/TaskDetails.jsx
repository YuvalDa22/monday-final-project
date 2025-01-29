import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'

import { IconButton } from '@mui/material'
import { TaskDetails_NavBar } from '../cmps/task/TaskDetails_NavBar'
import { boardService } from '../services/board.service.js'

export function TaskDetails() {
  const boardId = useOutletContext()
  const { taskId } = useParams()

  const navigate = useNavigate()
  console.log(boardId, 'SSSS')

  const [isExiting, setIsExiting] = useState(false) // State to control slide-out
  useEffect(() => {
    // these lines are to ensure proper handling incase user tries to access a task that doesn't exist (or)
    const task = boardService.getTaskById(taskId)
    if (!task) {
      navigate(`/workspace/board/${boardId}`)
      return
    }
    // To control outlet coming into view
    document.querySelector('.task-details').classList.add('active')
  }, [taskId])

  const handleClose = () => {
    setIsExiting(true) // trigger animation
    setTimeout(() => {
      navigate(`/workspace/board/${boardId}`)
    }, 250) // the delay is exactly the animation time, when animation end ONLY THEN we navigate back
  }

  return (
    <div className={`task-details ${isExiting ? 'notActive' : ''}`}>
      <div>
        <IconButton sx={{ padding: '2px', borderRadius: '5px' }} onClick={handleClose}>
          <CloseOutlinedIcon sx={{ opacity: 0.5 }} />
        </IconButton>
      </div>

      <div className='task-details-title'>Task ID : {taskId}</div>

      <div>
        <TaskDetails_NavBar taskId={taskId} />
      </div>
    </div>
  )
}
