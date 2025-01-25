import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
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
}

const STORAGE_KEY = 'boards'
_createBoards()

async function query(filterBy = {}) {
	try {
		let boards = await storageService.query(STORAGE_KEY)
		return boards
	} catch (error) {
		console.log('error:', error)
		throw error
	}
}

function getGroupById(/*boardId !@!@!@@!@!*/ groupId) {
	const boards = JSON.parse(localStorage.getItem('boards'))
	if (!boards) throw new Error('No boards found in local storage')

	const board = boards[0] // TODO: THIS ONLY GETS BOARD[0] !!@!@!@!@!@!!!!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@@@
	if (!board) throw new Error(`Board with ID ${boardId} not found`)

	const group = board.groups.find((group) => group.id === groupId)
	if (!group) throw new Error(`Group with ID ${groupId} not found`)

	return group
}

function getTaskById(groupId, taskId) {
	const boards = JSON.parse(localStorage.getItem('boards')) || []
	const board = boards[0] // TODO: THIS ONLY GETS BOARD[0] !!@!@!@!@!@!!!!!!!!!!@@@@@@@@@@@@@@@@@@@@@@@@@@
	if (!board) return null

	const group = board.groups.find((group) => group.id === groupId)
	if (!group) return null

	const task = group.tasks.find((task) => task.id === taskId)
	return task || null
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
		status: '',
		priority: '',
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

function createActivityLog(boardId, groupId, taskId, type, value, prevValue) {
	return {
		id: utilService.makeId(),
		createdAt: Date.now(),
		byMember: userService.getLoggedinUser(),
		board: boardId,
		group: groupId,
		task: taskId,
		type,
		value,
		prevValue,
	}
}

function _setNewGroupColor() {
	const colors = Array.from(groupColors.values())
	const randomIndex = Math.floor(Math.random() * colors.length)
	const randomColor = colors[randomIndex]
	return randomColor
}

function _createBoards() {
	let boards = utilService.loadFromStorage(STORAGE_KEY)
	if (!boards || !boards.length) {
		const boards = [
			{
				_id: 'b101',
				title: 'Board Name',
				isStarred: false,
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
					{ id: 'l201', title: 'Critical ⚠️', color: '#333333' },
					{ id: 'l202', title: 'High', color: '#401694' },
					{ id: 'l203', title: 'Medium', color: '#5559df' },
					{ id: 'l204', title: 'Low', color: '#579bfc' },
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
								memberIds: ['u102'],
							},
							{
								id: 'c102',
								title: 'Add Samples',
								memberIds: ['u101'],
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
								archivedAt: 1589983468418,
								memberIds: ['u103'],
								byMember: {
									_id: 'u101',
									username: 'Tal',
									fullname: 'Tal Tarablus',
									imgUrl:
										'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
								},
							},

							{
								id: 'c104',
								title: 'Help me',
								status: 'l101', // monday
								priority: 'l201',
								description: 'description',
								comments: [
									{
										id: 'ZdPnm',
										txt: 'also @yaronb please CR this',
										createdAt: 1590999817436,
										byMember: {
											_id: 'u101',
											fullname: 'Tal Tarablus',
											imgUrl:
												'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
										},
									},
								],
								checklists: [
									{
										id: 'YEhmF',
										title: 'Checklist',
										todos: [
											{
												id: '212jX',
												title: 'To Do 1',
												isDone: false,
											},
										],
									},
								],
								memberIds: ['u101', 'u102', 'u103'],
								labelIds: ['l101', 'l102'],
								dueDate: 16156215211,
								byMember: {
									_id: 'u101',
									username: 'Tal',
									fullname: 'Tal Tarablus',
									imgUrl:
										'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
								},
								style: {
									bgColor: '#26de81',
								},
							},
						],
						style: { color: 'purple' },
					},
				],
				activities: [
					{
						id: 'a101',
						txt: 'Changed Color',
						createdAt: 154514,
						byMember: {
							_id: 'u101',
							fullname: 'Abi Abambi',
							imgUrl: 'http://some-img',
						},
						task: {
							id: 'c101',
							title: 'Replace Logo',
						},
					},
				],

				cmpsOrder: ['status', 'priority', 'memberIds', 'dueDate'],
				cmpTitles: ['Status', 'Priority', 'Members', 'Due Date'],
				groupSummary: [null, null, null],
			},
		]

		utilService.saveToStorage(STORAGE_KEY, boards)
	}
}
