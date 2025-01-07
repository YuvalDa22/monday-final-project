import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const boardsService = {
  query,
  save,
  remove,
  getById,
  getDefaultFilter,
  getFilterFromSearchParams,
}

const STORAGE_KEY = 'boards'

async function query(filterBy = {}) {
  try {
    let boards = await storageService.query(STORAGE_KEY)

    if (filterBy.name) {
      const nameRegex = new RegExp(filterBy.name, 'i')
      boards = boards.filter((board) => nameRegex.test(board.name))
    }

    return boards
  } catch (error) {
    console.log('error:', error)
    throw error
  }
}

function getById(id) {
  return storageService.get(STORAGE_KEY, id)
}

function remove(id) {
  return storageService.remove(STORAGE_KEY, id)
}

function save(boardToSave) {
  if (boardToSave.id) {
    return storageService.put(STORAGE_KEY, boardToSave)
  } else {
    return storageService.post(STORAGE_KEY, boardToSave)
  }
}



function getDefaultFilter() {
  return {
    name: '',
  }
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter()
  const filterBy = {}
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || ''
  }
  return filterBy
}

