import { httpService } from '../http.service.js'


export const boardService = {
  query,
  getById,
  remove,
  save
}

async function query() {
  return httpService.get(`board`)
}

function getById(boardId, filterBy) {
  return httpService.get(`board/${boardId}`, filterBy)
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
