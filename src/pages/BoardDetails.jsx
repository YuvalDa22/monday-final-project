import { useSelector } from 'react-redux'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { GroupPreview } from '../cmps/group/GroupPreview'
import { useEffect } from 'react'
import { loadBoards } from '../store/board/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { Button } from '@mui/material'
import { updateBoard } from '../store/board/board.actions'
import { Footer } from '../cmps/layout/Footer'
import { boardService } from '../services/board.service'
import { useParams, Outlet } from 'react-router-dom'
import { utilService } from '../services/util.service'

export function BoardDetails() {
  const { boardId } = useParams()
  const allBoards = useSelector((storeState) => storeState.boardModule.boards)
  const board = allBoards.find((board) => board._id === boardId)
  const footerDisplayed = useSelector(
    (storeState) => storeState.boardModule.footerDisplayed
  )
  const checkedTasks = useSelector(
    (storeState) => storeState.boardModule.checkedTasks
  )

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
    if (!board) return
    let newGroup = boardService.getEmptyGroup()
    newGroup = {
      id: utilService.makeId(), // Generate and add ID to the top of the properties
      ...newGroup,
    }

    const updatedGroups = [...board?.groups, newGroup]
    updateBoard(board, null, null, { key: 'groups', value: updatedGroups })
    console.log(board, ' UPDATD BOARD')
  }

  return (
    <>
      <div className='board-details-container'>
        <div className='board-details-header'>
          <BoardHeader board={board} />
        </div>
        <div className='board-details-groups-container'>
          {board?.groups &&
            board?.groups.map((group) => (
              <GroupPreview
                board={board}
                group={group}
                cmpTitles={board.cmpTitles}
                cmpsOrder={board.cmpsOrder}
                key={group.id}
              />
            ))}
          <div className='add-group-button-container'>
            <Button
              variant='outlined'
              onClick={onAddGroup}
              sx={{
                color: 'black',
                borderColor: 'gray',
                textTransform: 'none',
              }}
            >
              Add new group
            </Button>
          </div>
        </div>
        {footerDisplayed && (
          <Footer board={board} checkedTasks={checkedTasks} />
        )}
        <Outlet context={boardId} /> {/* Task Details ! */}
      </div>
    </>
  )
}
