import { AdditionalBoardActions } from './AdditionalBoardActions'
import { BoardActionsBar } from './BoardActionsBar'
import { BoardNavBar } from './BoardNavBar'

// Note : We can ignore the props validation error for now
export function BoardHeader({ board }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>{board.title}</h1> {/* <AdditionalBoardActions /> */}
      <BoardNavBar />
      <BoardActionsBar />
    </div>
  )
}
