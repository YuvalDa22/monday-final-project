import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const boardService = {
	query,
	save,
	remove,
	getById,
	getCmpInfo,
	//   getDefaultFilter,
	//   getFilterFromSearchParams,
}

const STORAGE_KEY = 'boards'
_createBoards()
async function query(filterBy = {}) {
	try {
		let boards = await storageService.query(STORAGE_KEY)
		// if (filterBy.title) {
		// 	const nameRegex = new RegExp(filterBy.title, 'i')
		// 	boards = boards.filter((board) => nameRegex.test(board.title))
		// }

		return boards
	} catch (error) {
		console.log('error:', error)
		throw error
	}
}

async function getById(id) {
	return await storageService.get(STORAGE_KEY, id)
}

async function remove(id) {
	return await storageService.remove(STORAGE_KEY, id)
}

async function save(boardToSave) {
	if (boardToSave.id) {
		return await storageService.put(STORAGE_KEY, boardToSave)
	} else {
		return await storageService.post(STORAGE_KEY, boardToSave)
	}
}

function getCmpInfo(cmpType) {
	return cmps.find((cmp) => cmp.type === cmpType).info
}

// function getDefaultFilter() {
// 	return {
// 		title: '',
// 	}
// }

// function getFilterFromSearchParams(searchParams) {
// 	const defaultFilter = getDefaultFilter()
// 	const filterBy = {}
// 	for (const field in defaultFilter) {
// 		filterBy[field] = searchParams.get(field) || ''
// 	}
// 	return filterBy
// }

function _createBoards() {
	let boards = utilService.loadFromStorage(STORAGE_KEY)
	if (!boards || !boards.length)
	{
	boards =  [
		{
			_id: 'b101',
			title: 'My first project',
			createdAt: Date.now(),
			labels: [
				{
					id: 'l101',
					title: 'Done',
					color: '#61bd4f',
				},
				{
					id: 'l102',
					title: 'Progress',
					color: '#61bd33',
				},
			],

			members: [
				{
					_id: 'u101',
					fullname: 'Tal Tarablus',
				},
			],
			groups: [
				{
					id: 'g101',
					title: 'Group 1',
					tasks: [
						{
							id: 'c101',
							memberIds: ['u101'],
							title: 'Task 1',
							labelIds: ['l101', 'l102'],
							status: 'in-progress', // monday
							priority: 'high',
							byMember: {
								_id: 'u101',
								username: 'Tal',
								fullname: 'Tal Tarablus',
							},
						},
						{
							id: 'c102',
							memberIds: ['u101'],
							title: 'Task 2',
							labelIds: ['l101', 'l102'],
							status: 'in-progress', // monday
							priority: 'high',
							byMember: {
								_id: 'u101',
								username: 'Tal',
								fullname: 'Tal Tarablus',
							},
						},
					],
				},
				{
					id: 'g102',
					title: 'Group 2',
					tasks: [
						{
							id: 'c101',
							title: 'Task 1',
						},
						{
							id: 'c102',
							title: 'Task 2',
						},
						{
							id: 'c103',
							title: 'Task 3',
						},
					],
				},
			],
			cmpOrder: ['id', 'title', 'status', 'priority', 'members'],
			cmpTitles: ['Task', 'Status', 'Priority', 'Members'],
			groupSummary: [null, null, null],
		},
	]
	utilService.saveToStorage(STORAGE_KEY, boards)
	}
}

const cmps = [
	{
		type: 'status-picker',
		info: {
			selectedStatus: 'pending',
			statuses: [{}, {}],
		},
	},

	{
		type: 'member-picker',
		info: {
			selectedMembers: ['m1', 'm2'],
			members: ['m1', 'm2', 'm3'],
		},
	},

	{
		type: 'date-picker',
		info: {
			selectedDate: '2022-09-07',
		},
	},
]
