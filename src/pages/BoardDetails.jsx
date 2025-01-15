import { useSelector } from 'react-redux'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { GroupPreview } from '../cmps/group/GroupPreview'
import { useEffect } from 'react'
import { loadBoards } from '../store/board/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { Button } from '@mui/material'
import { updateBoard } from '../store/board/board.actions'
import { utilService } from '../services/util.service'
import { Footer } from '../cmps/layout/Footer'
import { boardService } from '../services/board.service'
import { Outlet, useParams } from 'react-router-dom'

export function BoardDetails() {
  const allBoards = useSelector((storeState) => storeState.boardModule.boards)
  const footerDisplayed = useSelector(
    (storeState) => storeState.boardModule.footerDisplayed
  )
  const checkedTasks = useSelector(
    (storeState) => storeState.boardModule.checkedTasks
  )
  const { boardId } = useParams()
  console.log('boardid', boardId)

  useEffect(() => {
    onLoadBoards()
  }, [])

  useEffect(() => {}, [footerDisplayed, checkedTasks])

  async function onLoadBoards() {
    try {
      await loadBoards()
    } catch (error) {
      showErrorMsg('Cannot load boards')
      console.error(error)
    }
  }

  if (!allBoards || allBoards.length === 0) return <div>Loading...</div>

  const onAddGroup = () => {
    const board = allBoards[0]
    console.log('board', board)
    if (!board) return
    const newGroup = boardService.getEmptyGroup()
    const updatedGroups = [...board.groups, newGroup]
    updateBoard(board, null, null, { key: 'groups', value: updatedGroups })
  }

  return (
    <>
      <div className='main-container'>
        <BoardHeader board={allBoards[0]} />
        {allBoards[0].groups &&
          allBoards[0].groups.map((group) => (
            <GroupPreview
              board={allBoards[0]}
              group={group}
              cmpTitles={allBoards[0].cmpTitles}
              cmpsOrder={allBoards[0].cmpsOrder}
              key={group.id}
            />
          ))}
        <Button variant='contained' color='primary' onClick={onAddGroup}>
          Add new group
        </Button>
      </div>
      {footerDisplayed && (
        <Footer board={allBoards[0]} checkedTasks={checkedTasks} />
      )}
      <Outlet context={boardId} /> {/* Task Details ! */}
    </>
  )

  // Ofir & Yuval
  // <>
  // <BoardHeader board={board}/>
  // {groups && groups.map(group => <GroupPreview group={group} board={board} key={group._id}/>)}

  // <button>add group</button>
  // </>
}
