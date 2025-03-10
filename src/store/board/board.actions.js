import { boardService } from '../../services/board'
import { store } from '../store'
import {
	ADD_BOARD,
	REMOVE_BOARD,
	SET_FILTER_BY,
	SET_BOARDS,
	SET_BOARD,
	UPDATE_BOARD,
	ADD_TASK,
	REMOVE_TASK,
	SET_IS_LOADING,
} from './board.reducer'
import { userService } from '../../services/user.service'
import { utilService } from '../../services/util.service'

export async function loadBoards(filterBy) {
	console.log('loadBoards called with filterBy:', filterBy) // Add this line for logging
	store.dispatch({ type: SET_IS_LOADING, isLoading: true })
	try {
		const boards = await boardService.query(filterBy)
		store.dispatch({ type: SET_BOARDS, boards: boards })
	} catch (err) {
		console.log(`Can't load boards - boards actions`)
		throw err
	} finally {
		store.dispatch({ type: SET_IS_LOADING, isLoading: false })
	}
}

export async function addBoard() {
	try {
		const boardToSave = boardService.getEmptyBoard()
		const savedBoard = await boardService.save(boardToSave)
		store.dispatch({ type: ADD_BOARD, savedBoard })

		return savedBoard
	} catch (err) {
		console.log(`Couldn't add board, board actions`, err)
		throw err
	}
}

//This gets 1 board from the array of all boards!!
export async function getBoardById(boardId) {
	const board = await boardService.getById(boardId)
	store.dispatch({ type: SET_BOARD, board: board })
}

export function logActivity(group, task, prev, action) {
	const board = store.getState().boardModule.currentBoard
	const updatedActivities = structuredClone(board.activities)
	let message, free_txt

	/*Why Use switch (true)?
  Allows Conditional Cases:
  We can check both exact string matches (e.g., action === 'addTask') and conditions (e.g., typeof action === 'object'). */
	switch (true) {
		case action === 'addTask':
			message = 'Created'
			free_txt = `Group: ${group.title}`
			break

		case action === 'removeTask':
			message = 'Deleted'
			free_txt = `From: "${group.title}"`
			break

		case action === 'duplicateTask':
			message = 'Duplicated'
			free_txt = `Group: ${group.title}`
			break

		case action === 'copyCreated':
			message = 'Created (Copy)'
			free_txt = `Group: ${group.title}`
			break

		case action === 'movedFrom':
			message = 'Moved'
			free_txt = `From Group: ${group.title}`
			break

		case action === 'movedTo':
			message = 'Moved'
			free_txt = `To Group: ${group.title}`
			break

		case action === 'groupDeleted':
			message = 'Group Deleted'
			free_txt = ``
			break
		case action === 'taskNameChanged':
			message = 'Task Name Changed'
			free_txt = `Group: ${group.title}`
			break

		case action === 'groupColorChanged':
			message = 'Group Color Changed'
			free_txt = ``
			break

		case action === 'groupCreated':
			message = 'Group Created'
			free_txt = ``
			break

		case action === 'boardCreated':
			message = 'Board Created'
			free_txt = ``
			break
		// Handle Object Actions
		case typeof action === 'object' && action.action === 'groupNameChanged':
			message = action.message
			free_txt = action.free_txt
			break

		case typeof action === 'object' && action.action === 'labelChanged':
			message = action.message
			free_txt = action.free_txt
			break
		case typeof action === 'object' && action.action === 'boardNameChanged':
			message = action.message
			free_txt = action.free_txt
			break

		default:
			console.error('Action was not logged !!!')
	}
	updatedActivities.unshift(
		createActivityLog(
			board?._id,
			group?.id,
			task?.id,
			message /*='Deleted'*/,
			free_txt /*=`From group "${group.title}"`*/,
			prev
		)
	)
	updateBoard(null, null, { key: 'activities', value: updatedActivities })
}

export async function updateBoard(groupId, taskId, { key, value }) {
	const board = store.getState().boardModule.currentBoard
	const gIdx = board?.groups.findIndex((groupItem) => groupItem.id === groupId)
	const tIdx = board?.groups[gIdx]?.tasks.findIndex((t) => t.id === taskId)

	try {
		if (gIdx !== -1 && tIdx !== -1) {
			board.groups[gIdx].tasks[tIdx][key] = value
		} else if (gIdx !== -1) {
			board.groups[gIdx][key] = value
		} else {
			board[key] = value
		}
		const updatedBoard = await boardService.save(board)
		store.dispatch({ type: SET_BOARD, board: updatedBoard })
	} catch (err) {
		console.error('Failed to save the board:', err)
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

// Task Actions
export async function addTask(_, group, task, fromHeader) {
	let updatedTasks
	if (group) {
		// In case 0 groups present , dont let "New Task" button crash program
		const updatedTask = { ...boardService.getEmptyTask(), ...task }
		updatedTasks = fromHeader ? [updatedTask, ...group.tasks] : [...group.tasks, updatedTask]
	}

	try {
		updateBoard(group.id, null, { key: 'tasks', value: updatedTasks })
		logActivity(group, task, group.tasks, 'addTask')
	} catch (error) {
		console.log(error, ' The group is probably null')
	}
}

export async function removeTask(_, group, task) {
	// const isConfirmed = window.confirm(
	//   'Are you sure you want to remove this task?'
	// )
	// if (!isConfirmed) return
	// console.log(
	//   'Removing task "' + task.title + '" From group "' + group.title,
	//   '"'
	// )
	const newTasks = group.tasks.filter((t) => t.id !== task.id)
	const newGroup = {
		...group,
		tasks: newTasks,
	}
	updateBoard(group.id, null, { key: 'tasks', value: newGroup.tasks })
	logActivity(group, task, group.tasks, 'removeTask')
}

export async function duplicateTask(_, group, task) {
	const newTask = {
		...task,
		id: utilService.makeId(),
		title: `${task.title} (copy)`,
	}

	// Insert new task below the duplicated one
	const taskIndex = group.tasks.findIndex((t) => t.id === task.id)
	const updatedTasks = [
		...group.tasks.slice(0, taskIndex + 1),
		newTask,
		...group.tasks.slice(taskIndex + 1),
	]
	const newGroup = { ...group, tasks: updatedTasks }

	updateBoard(group.id, null, { key: 'tasks', value: newGroup.tasks })
	// 2 logs , one for the duplicated task and one for the original task
	logActivity(group, task, null, 'duplicateTask') // No prev value
	logActivity(group, newTask, null, 'copyCreated')
}

export async function duplicateMultipleTasks(_, tasksToDuplicate) {
	const board = store.getState().boardModule.currentBoard
	const updatedGroups = board.groups

	// iterate through the tasks to be duplicated
	tasksToDuplicate.forEach(({ groupId, taskId }) => {
		// Find the group containing the task
		const groupIndex = updatedGroups.findIndex((group) => group.id === groupId)
		if (groupIndex === -1) {
			console.warn(`Group with id ${groupId} not found`)
			return
		}
		const group = updatedGroups[groupIndex]
		const taskIndex = group.tasks.findIndex((task) => task.id === taskId)
		if (taskIndex === -1) {
			console.warn(`Task with id ${taskId} not found in group ${groupId}`)
			return
		}
		// Create the duplicated task
		const taskToDuplicate = group.tasks[taskIndex]
		const duplicatedTask = {
			...taskToDuplicate,
			id: utilService.makeId(),
			title: `${taskToDuplicate.title} (copy)`,
		}
		// Insert the duplicated task right below the original
		group.tasks.splice(taskIndex + 1, 0, duplicatedTask)
		// Update the group in the updatedGroups array
		updatedGroups[groupIndex] = group

		// 2 logs , one for the duplicated task and one for the original task
		logActivity(group, duplicatedTask, null, 'copyCreated')
		logActivity(group, taskToDuplicate, null, 'duplicateTask')
	})
	// Update the board with the modified groups
	return updateBoard(null, null, {
		key: 'groups',
		value: updatedGroups,
	})
}

export async function removeMultipleTasks(_, checkedTasks) {
	// Todo : Add 'are you sure' and notify caller if user was sure or not about deleting checked tasks
	/* **Reminder**
	checkedTasks look like this : [{groupId: 123 , taskId:456}]*/

	const board = store.getState().boardModule.currentBoard
	let updatedGroups = board.groups
	// go through each group in the board
	updatedGroups = updatedGroups.map((group) => {
		// find tasks to remove that belong to the current group

		const tasksToRemove = checkedTasks.filter((checkedTask) => {
			if (checkedTask.groupId === group.id)
				logActivity(group, { id: checkedTask.taskId }, null, 'removeTask')
			return checkedTask.groupId === group.id
		})
		// if there are tasks to remove from this group
		if (tasksToRemove.length > 0) {
			const updatedTasks = group.tasks.filter(
				(task) => !tasksToRemove.some((checkedTask) => checkedTask.taskId === task.id)
			)
			// Return the updated group with filtered tasks
			return { ...group, tasks: updatedTasks }
		} else {
			return group
		} // If theres no tasks to remove, just return original group
	})
	updateBoard(null, null, { key: 'groups', value: updatedGroups })
}

export async function moveMultipleTasksIntoSpecificGroup(_, checkedTasks, targetGroupId) {
	/* Logic here is to grab and isolate the group were gonna move stuff into, and then
	   push the tasks that were checked by the user into that group while removing them from their original group*/

	const board = store.getState().boardModule.currentBoard
	let updatedGroups = board.groups
	// find the target group index in board.groups
	const targetGroupIndex = updatedGroups.findIndex((group) => group.id === targetGroupId)
	if (targetGroupIndex === -1) {
		console.error(`Target group with id ${targetGroupId} not found`)
		return
	}
	// extract the target group (the one we gonna move tasks into) from the array of all groups
	const targetGroup = {
		...updatedGroups[targetGroupIndex],
		tasks: [...updatedGroups[targetGroupIndex].tasks],
	}

	// iterate through each task in checkedTasks
	checkedTasks.forEach(({ groupId, taskId }) => {
		const sourceGroupIndex = updatedGroups.findIndex((group) => group.id === groupId)
		if (sourceGroupIndex === -1) {
			console.warn(`Source group with id ${groupId} not found`)
			return
		}
		// if the selected task is already in target group.. skip it
		if (sourceGroupIndex === targetGroupIndex) return
		// extract the group that contains the task were currently working on in our forEach loop
		const sourceGroup = {
			...updatedGroups[sourceGroupIndex],
			tasks: [...updatedGroups[sourceGroupIndex].tasks],
		}

		// find the index of the task to move
		const taskIndex = sourceGroup.tasks.findIndex((task) => task.id === taskId)
		if (taskIndex === -1) {
			console.warn(`Task with id ${taskId} not found in group ${groupId}`)
			return
		}
		// remove the task from the source group
		const [taskToMove] = sourceGroup.tasks.splice(taskIndex, 1)

		// log that it was moved from the old (source) group
		logActivity(sourceGroup, taskToMove, null, 'movedFrom')
		//  log that it was moved to the new (target) group
		logActivity(targetGroup, taskToMove, null, 'movedTo')
		// add the task to the target group
		targetGroup.tasks.push(taskToMove)
		// update the source group
		updatedGroups[sourceGroupIndex] = sourceGroup
	})
	// update the target group
	updatedGroups[targetGroupIndex] = targetGroup
	updateBoard(null, null, { key: 'groups', value: updatedGroups })
}

// Group Actions
export async function removeGroup(group) {
	const board = store.getState().boardModule.currentBoard
	const newGroups = board.groups.filter((g) => g.id !== group.id)
	logActivity(group, null, group, 'groupDeleted')
	updateBoard(null, null, { key: 'groups', value: newGroups })
}

export function setFilterBy(filterBy = {}) {
	store.dispatch({ type: SET_FILTER_BY, filterBy })
}

export async function getAllBoardsTitle() {
	const allBoards = await boardService.query()
	const allTitles = allBoards.map((board) => ({ id: board._id, title: board.title }))
	return allTitles
}

export function createActivityLog(boardId, groupId, taskId, action_name, free_txt, prevValue) {
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

export function getTaskById(taskId) {
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

export function getGroupById(groupId) {
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

export function getGroupByTaskId(taskId) {
	const board = store.getState().boardModule.currentBoard
	if (!board) {
		return null
	}

	for (const group of board.groups) {
		if (group.tasks.some((task) => task.id === taskId)) {
			return group // Return the group that contains the task
		}
	}

	return null // If no group contains the task, return null
}

function getCurrentBoardId() {
	const board = store.getState().boardModule.currentBoard
	return board._id
}
