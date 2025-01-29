import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import { TaskDetails_NavBar } from '../cmps/task/TaskDetails_NavBar'
import { boardService } from '../services/board.service.js'
import { ActivityLog } from '../cmps/task/cmps/ActivityLog.jsx'

export function MenuFromTheRight() {
  const boardId = useOutletContext()
  const { taskId, activity_log } = useParams()
  const navigate = useNavigate()
  const board = useSelector((storeState) => storeState.boardModule.currentBoard) // its here just so we can listen to board changes , for example if user changed task name while viewing task activity log , we want the change to be reflected here , thats all
  const taskNameRef = useRef(null)

  const [isExiting, setIsExiting] = useState(false) // State to control slide-out
  useEffect(() => {
    if (!activity_log) {
      // these lines are to ensure proper handling incase user tries to access a task that doesn't exist (or)
      const task = boardService.getTaskById(taskId) // params = taskId
      if (!task) {
        navigate(`/workspace/board/${boardId}`)
        return
      }
    }
    // To control outlet coming into view
    document.querySelector('.mftr-container').classList.add('active')
  }, [taskId])

  useEffect(() => {
    const taskTitle = boardService.getTaskById(taskId)?.title

    if (taskTitle != null) {
      taskNameRef.current = taskTitle
    }
  }, [taskId, board]) // the only reason for this is when user deletes task while activity log is open , so we save the task name in a useRef regardless of our board state

  const handleClose = () => {
    setIsExiting(true) // trigger animation
    setTimeout(() => {
      navigate(`/workspace/board/${boardId}`)
    }, 250) // the delay is exactly the animation time, when animation end ONLY THEN we navigate back
  }

  return (
    <div className={`mftr-container ${isExiting ? 'notActive' : ''}`}>
      <div>
        <IconButton sx={{ padding: '2px', borderRadius: '5px' }} onClick={handleClose}>
          <CloseOutlinedIcon sx={{ opacity: 0.5 }} />
        </IconButton>
      </div>
      {activity_log && (
        <div>
          <div className='activity_log-header'>Activity log for board "{board.title}"</div>
          <ActivityLog />
        </div>
      )}
      {!activity_log && (
        <div>
          <div className='activity_log-header'>
            Task : {boardService.getTaskById(taskId)?.title || taskNameRef.current}
          </div>

          <div>
            <TaskDetails_NavBar taskId={taskId} />
          </div>
        </div>
      )}
    </div>
  )
}
