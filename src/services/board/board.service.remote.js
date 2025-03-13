import { httpService } from '../http.service.js'


export const boardService = {
  query,
  getById,
  remove,
  save,
  filterBoard
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
  let savedBoard
  if (board._id) {
      savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
      savedBoard = await httpService.post('board', board)
  }
  return savedBoard
}


// Filter the board by the filterBy object
function filterBoard(board, filterBy) {
  if (!board) return
  
	// If there is no filterBy object, return the board as is
	if (filterBy) {
		let { txt = '' } = filterBy
		txt = txt.toLowerCase()

		// Filter by search text
		board.groups = board.groups
			.map((group) => {
				const filteredTasks = group.tasks.filter((task) => deepSearch(task, txt, board))
				if (filteredTasks.length > 0 || deepSearch(group, txt, board)) {
					return { ...group, tasks: filteredTasks }
				}
				return null
			})
			.filter(Boolean) // Remove empty groups

		// Filter by Groups
		if (filterBy.groups && filterBy.groups.length > 0) {
			board.groups = board.groups.filter((group) => {
				return filterBy.groups.includes(group.id)
			})
		}

		// Filter by Tasks
		if (filterBy.tasks && filterBy.tasks.length > 0) {
			filterGroupsByTasks('tasks', filterBy.tasks, board)
		}

		// Filter by Members
		if (filterBy.members && filterBy.members.length > 0) {
			filterGroupsByTasks('members', filterBy.members, board)
		}

		// Filter by Status Labels
		if (filterBy.statusLabels && filterBy.statusLabels.length > 0) {
			filterGroupsByTasks('statusLabels', filterBy.statusLabels, board)
		}

		// Filter by Priority Labels
		if (filterBy.priorityLabels && filterBy.priorityLabels.length > 0) {
			filterGroupsByTasks('priorityLabels', filterBy.priorityLabels, board)
		}
	}
	return board
}

// Filters the tasks within each group of a board based on the specified filter key and values
const filterGroupsByTasks = (filterKey, filterValues, board) => {
	board.groups = board.groups
		.map((group) => {
			const filteredTasks = group.tasks.filter((task) => {
				if (filterKey === 'tasks') return filterValues.includes(task.id)
				if (filterKey === 'members')
					return task.memberIds.some((memberId) => filterValues.includes(memberId))
				if (filterKey === 'statusLabels') return filterValues.includes(task.status)
				if (filterKey === 'priorityLabels') return filterValues.includes(task.priority)
				return false
			})
			if (filteredTasks.length > 0) {
				return { ...group, tasks: filteredTasks } // Keep the group with only the filtered tasks
			}
			return null
		})
		.filter(Boolean)
}

//  Recursive function to search in all keys and values
function deepSearch(obj, searchText, board) {
	if (typeof obj === 'string') {
		return obj.toLowerCase().includes(searchText)
	}

	if (typeof obj === 'number') {
		return obj.toString().includes(searchText)
	}

	if (Array.isArray(obj)) {
		return obj.some((item) => deepSearch(item, searchText, board)) // Search inside arrays
	}

	if (typeof obj === 'object' && obj !== null) {
		return Object.entries(obj).some(([key, value]) => {
			if (key === 'status' || key === 'priority') {
				const label = board.labels.find((label) => label.id === value)
				if (label && label.title.toLowerCase().includes(searchText)) {
					return true
				}
			}

			if (key === 'memberIds' && Array.isArray(value)) {
				return value.some((memberId) => {
					const member = board.members.find((member) => member._id === memberId)
					return member && member.fullname.toLowerCase().includes(searchText)
				})
			}

			// Ensure keys and values are both searched
			return key.toLowerCase().includes(searchText) || deepSearch(value, searchText, board)
		})
	}

	return false
}