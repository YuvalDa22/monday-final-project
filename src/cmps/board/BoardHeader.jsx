import { Stack } from '@mui/material'
import { AdditionalBoardActions } from './AdditionalBoardActions'
import { BoardActionsBar } from './BoardActionsBar'
import { BoardNavBar } from './BoardNavBar'
import Input from '@mui/joy/Input'
import { useState } from 'react'
import { updateBoard } from '../../store/board/board.actions'

// Note : We can ignore the props validation error for now
export function BoardHeader({ board, onAddGroup, onAddTask }) {
  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false)
  const [boardTempTitle, setBoardTempTitle] = useState(board?.title || '')

  const handleBoardTitleSave = () => {
    if (boardTempTitle.trim() && boardTempTitle !== board?.title) {
      board.activities.unshift(
        createActivityLog(board._id, null, null, 'Board Name Changed', ``, board.title) // prevValue = board.title
      )
      updateBoard(board, null, null, { key: 'title', value: boardTempTitle })
    }
    setIsEditingBoardTitle(false)
  }

  return (
    <div className='boardHeader_main-container'>
      <div className='boardHeader_title_and_additionalBoardActions'>
        {isEditingBoardTitle ? (
          <Input
            autoFocus
            type='text'
            value={boardTempTitle}
            onChange={(event) => setBoardTempTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleBoardTitleSave()
              if (event.key === 'Escape') setIsEditingBoardTitle(false)
            }}
            onBlur={handleBoardTitleSave}
            sx={{
              width: `${boardTempTitle.length + 2.5}ch`,
              minWidth: '6ch',
            }}
          />
        ) : (
          <span className='boardHeader_boardName' onClick={() => setIsEditingBoardTitle(true)}>
            {board?.title}
          </span>
        )}
        <AdditionalBoardActions />
      </div>
      <BoardNavBar />
      <BoardActionsBar board={board} onAddTask={onAddTask} onAddGroup={onAddGroup} />
    </div>
  )
}
