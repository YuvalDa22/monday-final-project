import { Stack } from '@mui/material'
import { AdditionalBoardActions } from './AdditionalBoardActions'
import { BoardActionsBar } from './BoardActionsBar'
import { BoardNavBar } from './BoardNavBar'
import Input from '@mui/joy/Input'
import { useState } from 'react'
import { updateBoard } from '../../store/board/board.actions'

// Note : We can ignore the props validation error for now
export function BoardHeader({ board }) {
  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false)
  const [boardTempTitle, setBoardTempTitle] = useState(board?.title || '')

  const handleBoardTitleSave = () => {
    if (boardTempTitle.trim() && boardTempTitle !== board?.title) {
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
              minWidth: '5ch',
            }}
          />
        ) : (
          <h1 onClick={() => setIsEditingBoardTitle(true)}>{board?.title}</h1>
        )}
        <AdditionalBoardActions />
      </div>
      <BoardNavBar />
      <BoardActionsBar />
    </div>
  )
}
