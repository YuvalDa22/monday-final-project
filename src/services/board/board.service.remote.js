import { httpService } from '../http.service.js'


export const boardService = {
  query,
  getById,
  remove,
  save,
  updateBoard,
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

// the save function is used only for adding a new board and not for updating an existing one
async function save(board) { 
    return await httpService.post('board', board)
}

async function updateBoard(board, groupId, taskId, { key, value }) {
  if (!board) return
  return await httpService.put(`board/${board._id}`, { board, groupId, taskId, change: { key, value } })
}
