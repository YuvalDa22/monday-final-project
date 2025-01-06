import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardsService } from '../../services/boards.service'
import { store } from '../store'


import {
  ADD_BOARD,
  EDIT_BOARD,
  REMOVE_BOARD,
  SET_FILTER,
  //   SET_IS_LOADING,
  SET_BOARDS,
} from './boards.reducer'


export async function loadBoards(filterBy) {
  try {
    const boards = await boardsService.query(filterBy)
    await store.dispatch({ type: SET_BOARDS, boards })
    showSuccessMsg('boards fetched')
  } catch (err) {
    showErrorMsg('Having issues with loading boards:')
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardsService.remove(boardId)
    store.dispatch({ type: REMOVE_BOARD, boardId })
  } catch (err) {
    console.log('Having issues removing board:', err)
    throw err
  }
}



export async function saveBoard(boardToSave) {
  try {
    const type = boardToSave.id ? EDIT_BOARD : ADD_BOARD
    const board = await boardsService.save(boardToSave)
    store.dispatch({ type, board })
  } catch (err) {
    console.log('Having issues saving board:', err)
    throw err
  }
}

export function setFilterBy(filterBy = {}) {
  store.dispatch({ type: SET_FILTER, filterBy })
  console.log(filterBy, 'from the filter function')
}
