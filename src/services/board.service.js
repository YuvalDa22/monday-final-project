import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { store } from '../store/store.js'

const groupColors = new Map([
	['red', '#bb3354'],
	['green', '#037f4c'],
	['lightGreen', '#00c875'],
	['lime', '#9cd326'],
	['yellow', '#cab641'],
	['gold', '#ffcb00'],
	['purple', '#784bd1'],
	['violet', '#9d50dd'],
	['blue', '#007eb5'],
	['lightBlue', '#579bfc'],
	['skyBlue', '#66ccff'],
	['pink', '#df2f4a'],
	['hotPink', '#ff007f'],
	['lightPink', '#ff5ac4'],
	['orange', '#ff642e'],
	['amber', '#fdab3d'],
	['brown', '#7f5347'],
	['gray', '#c4c4c4'],
	['darkGray', '#757575'],
])

export const boardService = {
	query,
	save,
	remove,
	getById,
	createActivityLog,
	getEmptyBoard,
	getEmptyGroup,
	getEmptyTask,
	getTaskById,
	getGroupById,
	groupColors,
	updateBoard,
	getFilterFromSearchParams,
	getDefaultFilter,
}

const STORAGE_KEY = 'boards'
_createBoards()

//////////////////////////

async function updateBoard(board, groupId, taskId, { key, value }) {
	if (!board) return
	const gIdx = board?.groups.findIndex((groupItem) => groupItem.id === groupId)
	const tIdx = board?.groups[gIdx]?.tasks.findIndex((t) => t.id === taskId)

	if (gIdx !== -1 && tIdx !== -1) {
		board.groups[gIdx].tasks[tIdx][key] = value
	} else if (gIdx !== -1) {
		board.groups[gIdx][key] = value
	} else {
		board[key] = value
	}
	try {
		await save(board)
		return board
	} catch (err) {
		console.error('Failed to save the board:', err)
		throw err
	}
}

/////////////////////////

async function query(filterBy, boardId) {
	try {
		let boards = await storageService.query(STORAGE_KEY)

		if (boardId) {
			let board = boards.find((board) => board._id === boardId)
			if (!board) return null // Ensure board exists

			if (filterBy) {
				let { txt = '' } = filterBy
				txt = txt.toLowerCase()

				// Filter groups based on tasks that match the search text
				board.groups = board.groups.map((group) => {
						const filteredTasks = group.tasks.filter((task) => deepSearch(task, txt))
						if (filteredTasks.length > 0 || deepSearch(group, txt)) {
							return { ...group, tasks: filteredTasks } // Keep the group if it or any task matches
						}
						return null // Remove group if no matching task or group data
					})
					.filter(Boolean) // Remove `null` groups
			}
			return board
		}
		return boards
	} catch (error) {
		console.log('error:', error)
		throw error
	}
}

//  Recursive function to search in all keys and values
function deepSearch(obj, searchText) {
	if (typeof obj === 'string') {
		return obj.toLowerCase().includes(searchText)
	}

	if (typeof obj === 'object' && obj !== null) {
		return Object.entries(obj).some(
			([key, value]) => key.toLowerCase().includes(searchText) || deepSearch(value, searchText)
		)
	}
	return false
}

function getBoardById(boardId) {
	const board = store.getState().boardModule.currentBoard
	return board || null // Return the board if found, otherwise return null
}

function getGroupById(groupId) {
	const board = store.getState().boardModule.currentBoard
	if (!board) {
		return null
	}

	const group = board.groups.find((group) => group.id === groupId)
	if (group) {
		return group // Return the group as soon as it's found
	}
	return null // If no group is found, return null
}

function getTaskById(taskId) {
	const board = store.getState().boardModule.currentBoard
	// Traverse all boards

	for (const group of board.groups) {
		// Search for the task within the group's tasks
		const task = group.tasks.find((task) => task.id === taskId)
		if (task) {
			return task // Return the task as soon as it's found
		}
	}

	return null // If no task is found, return null
}

async function getById(id) {
	return await storageService.get(STORAGE_KEY, id)
}

async function remove(id) {
	return await storageService.remove(STORAGE_KEY, id)
}

async function save(boardToSave) {
	if (boardToSave._id) {
		return await storageService.put(STORAGE_KEY, boardToSave)
	} else {
		return await storageService.post(STORAGE_KEY, boardToSave)
	}
}

function getEmptyBoard() {
	return {
		title: '',
		isStarred: false,
		archivedAt: 0,
		createdBy: {
			_id: '',
			fullname: '',
			imgUrl: '',
		},
		style: {},
		labels: [],
		members: [],
		groups: [],
		archivedItems: [], //Groups or Tasks
		activities: [],
		cmpsOrder: [],
		cmpTitles: [],
		groupSummary: [],
	}
}

function getEmptyGroup() {
	return {
		title: 'New Group',
		archivedAt: 0,
		tasks: [],
		archivedItems: [],
		style: { color: _setNewGroupColor() },
	}
}

function getEmptyTask() {
	return {
		title: '',
		archivedAt: 0,
		status: 'l101',
		priority: 'l201',
		description: '',
		comments: [],
		checklists: [],
		memberIds: [],
		labelIds: [],
		dueDate: 0,
		byMember: {},
		style: {},
	}
}

function createActivityLog(boardId, groupId, taskId, action_name, free_txt, prevValue) {
	return {
		id: utilService.makeId(),
		createdAt: Date.now(),
		byMember: userService.getLoggedinUser(),
		board: { id: boardId, title: getBoardById(boardId).title },
		group: { id: groupId, title: getGroupById(groupId)?.title },
		task: { id: taskId, title: getTaskById(taskId)?.title }, // we keep title so we can access title if task removed from board
		action_name, // For example : "Moved" , "Duplicated" , "Deleted"
		free_txt, // For example : "To group New Group" or "From group ASAP Tasks"
		prevValue, // Holds the previous value of the task/group/board before the change
	}
}

function _setNewGroupColor() {
	const colors = Array.from(groupColors.values())
	const randomIndex = Math.floor(Math.random() * colors.length)
	const randomColor = colors[randomIndex]
	return randomColor
}

function getFilterFromSearchParams(searchParams) {
	const defaultFilter = getDefaultFilter()
	const filterBy = {}
	for (const field in defaultFilter) {
		filterBy[field] = searchParams.get(field) || ''
	}
	return filterBy
}

function getDefaultFilter() {
	return {
		txt: '',
	}
}

function _createBoards() {
	let boards = utilService.loadFromStorage(STORAGE_KEY)
	if (!boards || !boards.length) {
		const boards = [
			{
				_id: 'b101',
				title: 'Board Name',
				isStarred: true,
				archivedAt: 1589983468418,
				createdBy: {
					_id: 'u101',
					fullname: 'Abi Abambi',
					imgUrl: 'http://some-img',
				},
				archivedItems: [
					{
						id: 'g103',
						type: 'group',
						archivedAt: 1673894400000,
					},
				],
				style: {},
				labels: [
					// Status Labels (l101 - l199)
					{ id: 'l101', title: '', color: '#c4c4c4' },
					{ id: 'l102', title: 'Done', color: '#00c875' },
					{ id: 'l103', title: 'Working on it', color: '#fdab3d' },
					{ id: 'l104', title: 'Stuck', color: '#df2f4a' },
					// Priority Labels (l201 - l299)
					{ id: 'l201', title: '', color: '#c4c4c4' },
					{ id: 'l202', title: 'Critical ⚠️', color: '#333333' },
					{ id: 'l203', title: 'High', color: '#401694' },
					{ id: 'l204', title: 'Medium', color: '#5559df' },
					{ id: 'l205', title: 'Low', color: '#579bfc' },
				],
				members: [
					{
						_id: 'u101',
						fullname: 'Tal Tarablus',
						imgUrl: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
					},
					{
						_id: 'u102',
						fullname: 'Yuval Dadon',
						imgUrl: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250',
					},
					{
						_id: 'u103',
						fullname: 'Ofir Gady',
						imgUrl: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250',
					},
				],
				groups: [
					{
						id: 'g101',
						title: 'Group 1',
						archivedAt: 1589983468418,
						tasks: [
							{
								id: 'c101',
								title: 'Replace logo',
								status: 'l103',
								priority: 'l202',
								description: 'Update the logo across all marketing materials.',
								comments: [
									{
										id: 'ZdPnm1',
										txt: 'Please finalize the design.',
										createdAt: 1590999817436,
										byMember: {
											_id: 'u102',
											fullname: 'Yuval Dadon',
											imgUrl: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250',
										},
									},
								],
								checklists: [
									{
										id: 'YEhmF1',
										title: 'Checklist 1',
										todos: [
											{ id: '212jX1', title: 'Design Draft', isDone: true },
											{ id: '212jX2', title: 'Approval', isDone: false },
										],
									},
								],
								memberIds: ['u102'],
								labelIds: ['l103', 'l202'],
								dueDate: 16156215211,
								style: {},
							},
							{
								id: 'c102',
								title: 'Add Samples',
								status: 'l104',
								priority: 'l201',
								description: 'Collect and upload new sample files.',
								comments: [],
								checklists: [],
								memberIds: ['u101'],
								labelIds: ['l101'],
								dueDate: null,
								style: {},
							},
						],
						style: { color: 'red' },
					},
					{
						id: 'g102',
						title: 'Group 2',
						tasks: [
							{
								id: 'c103',
								title: 'Do that',
								status: 'l102',
								priority: 'l204',
								description: 'Complete task as requested.',
								comments: [
									{
										id: 'ZdPnm2',
										txt: 'Looks good, proceed.',
										createdAt: 1590999817436,
										byMember: {
											_id: 'u101',
											fullname: 'Tal Tarablus',
											imgUrl: 'https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk',
										},
									},
								],
								checklists: [
									{
										id: 'YEhmF2',
										title: 'Steps',
										todos: [
											{ id: '212jX3', title: 'Gather resources', isDone: true },
											{ id: '212jX4', title: 'Implement', isDone: false },
										],
									},
								],
								memberIds: ['u103'],
								labelIds: ['l102', 'l204'],
								dueDate: 16156215211,
								style: { bgColor: '#fff3cd' },
							},
							{
								id: 'c104',
								title: 'Help me',
								status: 'l103',
								priority: 'l202',
								description: 'Urgent task requires support.',
								comments: [
									{
										id: 'ZdPnm3',
										txt: 'I will handle this today.',
										createdAt: 1590999817436,
										byMember: {
											_id: 'u102',
											fullname: 'Yuval Dadon',
											imgUrl: 'https://eu.ui-avatars.com/api/?name=John+Doe&size=250',
										},
									},
								],
								checklists: [],
								memberIds: ['u101', 'u102', 'u103'],
								labelIds: ['l104'],
								dueDate: 16256215211,
								style: { bgColor: '#cce5ff' },
							},
						],
						style: { color: 'purple' },
					},
				],
				activities: [
					// {
					//   // picture for reference https://i.imgur.com/AMMkPT2.png
					//   id: 'a101',
					//   createdAt: Date.now(),
					//   byMember: {
					//     _id: 'u101',
					//     fullname: 'Abi Abambi',
					//     imgUrl: 'http://some-img',
					//   },
					//   boardid: 'b101',
					//   groupid: 'g101', // if this is null, then it's a board activity
					//   taskid: 'c101', // If this is null, then it's a group activity
					//   action_name: 'Created', // Or 'Updated' Or 'Moved' Or 'Deleted' etc etc... perhaps 'Updated' could be broken down into more specific names like 'Name changed' or 'Color Changed'
					//   free_txt: 'Group created', // Or 'Group deleted' or 'Group moved to another board' etc etc
					//   prevValue: null, // This remembers the last value of the task/group/board before the change
					// },
				],
				cmpsOrder: ['status', 'priority', 'memberIds', 'dueDate'],
				cmpTitles: ['Status', 'Priority', 'Members', 'Due Date'],
				groupSummary: [null, null, null],
			},
		]

		utilService.saveToStorage(STORAGE_KEY, boards)
	}

}
