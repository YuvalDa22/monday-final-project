import { Stack } from '@mui/material'
import { AdditionalBoardActions } from './AdditionalBoardActions'
import { BoardActionsBar } from './BoardActionsBar'
import { BoardNavBar } from './BoardNavBar'

// Note : We can ignore the props validation error for now
export function BoardHeader({ board }) {
  return (
    <div className='boardHeader_main-container'>
      <div className='boardHeader_title_and_additionalBoardActions'>
        <h1>{board.title}</h1> {/* <AdditionalBoardActions /> */}
        <AdditionalBoardActions />
      </div>
      <BoardNavBar />
      <BoardActionsBar />
    </div>
  )
}
