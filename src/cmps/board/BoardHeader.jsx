import { Stack } from '@mui/material'
import { AdditionalBoardActions } from './AdditionalBoardActions'
import { BoardActionsBar } from './BoardActionsBar'
import { BoardNavBar } from './BoardNavBar'
import Input from '@mui/joy/Input'
import { useState, useEffect } from 'react'
import { updateBoard, logActivity } from '../../store/board/board.actions'
import { use } from 'react'
import { set } from 'date-fns'
import { useSelector } from 'react-redux'


// Note : We can ignore the props validation error for now
export function BoardHeader({ board, onAddGroup, onAddTask ,filterBy, onSetFilterBy, currentBoard }) {
  const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false)
  const [boardTempTitle, setBoardTempTitle] = useState(board?.title || '')


  //Change temp title when board changes
  useEffect(() => {
    setBoardTempTitle(board?.title || '')  
  }, [board])

  const handleBoardTitleSave = () => {
    if (boardTempTitle.trim() && boardTempTitle !== board?.title) {
      updateBoard(null, null, { key: 'title', value: boardTempTitle } ,{action: 'boardNameChanged'})
    }
    setIsEditingBoardTitle(false)
  }

  function getTextWidth(text, font = 'normal 501 25px Figtree') {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = font
    return context.measureText(text).width // Returns width in pixels
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
              padding: '0px',
              width: `${getTextWidth(boardTempTitle, 'normal 501 25px Figtree') + 10}px`,
              minWidth: '3ch',
              fontSize: '25px',
              alignContent: 'center',
              fontWeight: '500',
            }}
          />
        ) : (
          <span className='boardHeader_boardName' onClick={() => setIsEditingBoardTitle(true)}>
            {board?.title}
          </span>
        )}
        <AdditionalBoardActions board={board}/>
      </div>
      <BoardNavBar />
      <BoardActionsBar board={board} onAddTask={onAddTask} onAddGroup={onAddGroup} filterBy={filterBy} onSetFilterBy={onSetFilterBy} currentBoard={currentBoard}/>
    </div>
  )
}
