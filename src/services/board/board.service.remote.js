import { httpService } from '../http.service.js'


export const boardService = {
  query,
  getById,
  remove,
  save,
}

async function query() {
  return httpService.get(`board`)
}

function getById(boardId) {
  return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
  return httpService.delete(`board/${boardId}`)
}

async function save(board) {
  let savedBoard
  if (board._id) {
      savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
      savedBoard = await httpService.post('board', board)
  }
  return savedBoard
}
