import { httpService } from '../http.service.js'


export const boardService = {
  query,
  getById,
  remove,
  save
}

async function query(filterBy = {}) {
  return httpService.get(`board`, filterBy)
}

function getById(boardId) {
  return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
  return httpService.delete(`board/${boardId}`)
}

async function save(board) {
  var savedBoard
  if (board._id) {
      savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
      savedBoard = await httpService.post('board', board)
  }
  return savedBoard
}
