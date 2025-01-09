import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardService } from '../../services/board.service'
import { store } from '../store'
import {  ADD_BOARD,  REMOVE_BOARD,  SET_FILTER_BY,  SET_BOARDS, UPDATE_BOARD} from './board.reducer'



export async function loadBoards(filterBy) {
  try {
    const boards = await boardService.query(filterBy)
    store.dispatch({ type: SET_BOARDS, boards })
  } catch (err) {
    console.log('board actions -> Cannot load boards:', err)
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId)
    store.dispatch({ type: REMOVE_BOARD, boardId })
  } catch (err) {
    console.log('board actions -> Cannot remove board:', err)
    throw err
  }
}

export async function saveBoard(board) {
  try {
    const type = board._id ? UPDATE_BOARD : ADD_BOARD;
    const savedBoard = await boardService.save(board)
    store.dispatch({ type, board: savedBoard })
  } catch (err) {
    console.log('board actions -> Cannot save board:', err)
    throw err
  }
}

export function setFilterBy(filterBy = {}) {
  store.dispatch({ type: SET_FILTER_BY, filterBy })
  console.log('board actions -> filterBy: ' ,filterBy)
}
