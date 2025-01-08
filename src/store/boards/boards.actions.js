import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardsService } from '../../services/boards.service'
import { store } from '../store'
import {  ADD_BOARD,  REMOVE_BOARD,  SET_FILTER_BY,  SET_BOARDS, UPDATE_BOARD} from './boards.reducer'



export async function loadBoards(filterBy) {
  try {
    const boards = await boardsService.query(filterBy)
    store.dispatch({ type: SET_BOARDS, boards })
  } catch (err) {
    console.log('board actions -> Cannot load boards:', err)
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardsService.remove(boardId)
    store.dispatch({ type: REMOVE_BOARD, boardId })
  } catch (err) {
    console.log('board actions -> Cannot remove board:', err)
    throw err
  }
}

export async function saveBoard(board) {
  try {
    const type = board._id ? UPDATE_BOARD : ADD_BOARD;
    const savedBoard = await boardsService.save(board)
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
