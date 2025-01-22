import { boardService } from '../../services/board.service'
import { store } from '../store'
import {
	ADD_BOARD,
	REMOVE_BOARD,
	SET_FILTER_BY,
	SET_BOARDS,
	UPDATE_BOARD,
	ADD_TASK,
	REMOVE_TASK,
} from './board.reducer'
import { userService } from '../../services/user.service'
import { utilService } from '../../services/util.service'

// Board Actions
export async function loadBoards(filterBy) {
	try {
		const boards = await boardService.query(filterBy)
		store.dispatch({ type: SET_BOARDS, boards })
		return boards
	} catch (err) {
		console.error('Cannot load boards:', err)
		throw err
	}
}

export async function saveBoard(board) {
	try {
		const type = board._id ? UPDATE_BOARD : ADD_BOARD
		const savedBoard = await boardService.save(board)
		store.dispatch({ type, board: savedBoard })
	} catch (err) {
		console.error('Cannot save board:', err)
		throw err
	}
}

export async function removeBoard(boardId) {
	try {
		await boardService.remove(boardId)
		store.dispatch({ type: REMOVE_BOARD, boardId })
	} catch (err) {
		console.error('Cannot remove board:', err)
		throw err
	}
}

export async function updateBoard(board, group, task, { key, value }) {
	if (!board) return
	const gIdx = board?.groups.findIndex((groupItem) => groupItem.id === group?.id)
	const tIdx = board?.groups[gIdx]?.tasks.findIndex((t) => t.id === task?.id)
	let activity = null
	if (gIdx !== -1 && tIdx !== -1) {
		activity = boardService.createActivityLog(
			board._id,
			group.id,
			task.id,
			key,
			value,
			board.groups[gIdx].tasks[tIdx][key]
		)
		board.groups[gIdx].tasks[tIdx][key] = value
	} else if (gIdx !== -1) {
		activity = boardService.createActivityLog(
			board._id,
			group.id,
			null,
			key,
			value,
			board.groups[gIdx][key]
		)
		board.groups[gIdx][key] = value
	} else {
		activity = boardService.createActivityLog(board._id, null, null, key, value, board[key])
		board[key] = value
	}
	if (activity) board.activities.unshift(activity)
	try {
		await saveBoard(board)
	} catch (err) {
		console.error('Failed to save the board:', err)
		throw err
	}
}

// Task Actions
export async function addTask(board, group, task, fromHeader) {
	store.dispatch({
		type: ADD_TASK,
		boardId: board._id,
		groupId: group.id,
		task: task,
	})
	const updatedTasks = fromHeader ? [task, ...group.tasks] : [...group.tasks, task]
	updateBoard(board, group, null, { key: 'tasks', value: updatedTasks })
}

export async function removeTask(board, group, task) {
	store.dispatch({ type: REMOVE_TASK, taskId: task.id })
	const newTasks = group.tasks.filter((t) => t.id !== task.id)
	updateBoard(board, group, null, { key: 'tasks', value: newTasks })
}

export async function duplicateTask(board, group, task) {
	const newTask = {
		...task,
		id: utilService.makeId(),
		title: `${task.title} (copy)`,
	}
	const taskIndex = group.tasks.findIndex((t) => t.id === task.id)
	const updatedTasks = [
		...group.tasks.slice(0, taskIndex + 1),
		newTask,
		...group.tasks.slice(taskIndex + 1),
	]
	updateBoard(board, group, null, { key: 'tasks', value: updatedTasks })
}

export async function duplicateMultipleTasks(board, tasksToDuplicate) {
	const updatedGroups = structuredClone(board.groups)
	tasksToDuplicate.forEach(({ groupId, taskId }) => {
		const groupIndex = updatedGroups.findIndex((group) => group.id === groupId)
		if (groupIndex === -1) return
		const group = updatedGroups[groupIndex]
		const taskIndex = group.tasks.findIndex((task) => task.id === taskId)
		if (taskIndex === -1) return
		const taskToDuplicate = group.tasks[taskIndex]
		const duplicatedTask = {
			...taskToDuplicate,
			id: utilService.makeId(),
			title: `${taskToDuplicate.title} (copy)`,
		}
		group.tasks.splice(taskIndex + 1, 0, duplicatedTask)
		updatedGroups[groupIndex] = group
	})
	updateBoard(board, null, null, { key: 'groups', value: updatedGroups })
}

export async function removeMultipleTasks(board, checkedTasks) {
	let updatedGroups = structuredClone(board.groups)
	updatedGroups = updatedGroups.map((group) => {
		const tasksToRemove = checkedTasks.filter((checkedTask) => checkedTask.groupId === group.id)
		if (tasksToRemove.length > 0) {
			const updatedTasks = group.tasks.filter(
				(task) => !tasksToRemove.some((checkedTask) => checkedTask.taskId === task.id)
			)
			return { ...group, tasks: updatedTasks }
		} else {
			return group
		}
	})
	updateBoard(board, null, null, { key: 'groups', value: updatedGroups })
}

export async function moveMultipleTasksIntoSpecificGroup(board, checkedTasks, targetGroupId) {
	let updatedGroups = structuredClone(board.groups)
	const targetGroupIndex = updatedGroups.findIndex((group) => group.id === targetGroupId)
	if (targetGroupIndex === -1) return
	const targetGroup = {
		...updatedGroups[targetGroupIndex],
		tasks: [...updatedGroups[targetGroupIndex].tasks],
	}
	checkedTasks.forEach(({ groupId, taskId }) => {
		const sourceGroupIndex = updatedGroups.findIndex((group) => group.id === groupId)
		if (sourceGroupIndex === -1 || sourceGroupIndex === targetGroupIndex) return
		const sourceGroup = {
			...updatedGroups[sourceGroupIndex],
			tasks: [...updatedGroups[sourceGroupIndex].tasks],
		}
		const taskIndex = sourceGroup.tasks.findIndex((task) => task.id === taskId)
		if (taskIndex === -1) return
		const [taskToMove] = sourceGroup.tasks.splice(taskIndex, 1)
		targetGroup.tasks.push(taskToMove)
		updatedGroups[sourceGroupIndex] = sourceGroup
	})
	updatedGroups[targetGroupIndex] = targetGroup
	updateBoard(board, null, null, { key: 'groups', value: updatedGroups })
}

// Group Actions
export async function removeGroup(board, group) {
	const newGroups = board.groups.filter((g) => g.id !== group.id)
	updateBoard(board, null, null, { key: 'groups', value: newGroups })
}


export function setFilterBy(filterBy = {}) {
	store.dispatch({ type: SET_FILTER_BY, filterBy })
}
