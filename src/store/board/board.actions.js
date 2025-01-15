import { boardService } from '../../services/board.service'
import { store } from '../store'
import {
  ADD_BOARD,
  REMOVE_BOARD,
  SET_FILTER_BY,
  SET_BOARDS,
  UPDATE_BOARD,
  SET_FOOTER,
  SET_CHECKED_TASKS,
} from './board.reducer'
import { userService } from '../../services/user.service'

export async function loadBoards(filterBy) {
  try {
    const boards = await boardService.query(filterBy)
    store.dispatch({ type: SET_BOARDS, boards })
    return boards
  } catch (err) {
    console.log('board actions -> Cannot load boards:', err)
    throw err
  }
}

export async function removeBoard(boardId) {
  try {
    await boardService.remove(boardId)
    store.dispatch({ type: REMOVE_BOARD, boardId })
  } catch (err) {
    console.log('board actions -> Cannot remove board:', err)
    throw err
  }
}

export async function saveBoard(board) {
  try {
    const type = board._id ? UPDATE_BOARD : ADD_BOARD
    const savedBoard = await boardService.save(board)
    store.dispatch({ type, board: savedBoard })
  } catch (err) {
    console.log('board actions -> Cannot save board:', err)
    throw err
  }
}

export async function removeTask(board, group, task) {
  // const isConfirmed = window.confirm(
  //   'Are you sure you want to remove this task?'
  // )
  // if (!isConfirmed) return

  console.log('Removing task"', task.title, '" From group "', group.title, '"')

  store.dispatch({ type: 'REMOVE_TASK', taskId: task.id })
  const newTasks = group.tasks.filter((t) => t.id !== task.id)
  const newGroup = {
    ...group,
    tasks: newTasks,
  }

  updateBoard(board, group, null, { key: 'tasks', value: newGroup.tasks })
}

export function setFilterBy(filterBy = {}) {
  store.dispatch({ type: SET_FILTER_BY, filterBy })
  console.log('board actions -> filterBy: ', filterBy)
}

export function setFooter(boolValue) {
  store.dispatch({ type: SET_FOOTER, footerDisplayed: boolValue })
}

export function setCheckedTasks(tasks) {
  store.dispatch({ type: SET_CHECKED_TASKS, checkedTasks: [...tasks] })
}

export async function updateBoard(board, group, task, { key, value }) {
  if (!board) return

  const gIdx = board?.groups.findIndex(
    (groupItem) => groupItem.id === group?.id
  )
  const tIdx = board?.groups[gIdx]?.tasks.findIndex((t) => t.id === task?.id)

  let activity = null
  let userMsg = ''

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
    board.activities.unshift(activity)
    userMsg = 'Task updated successfully'
    console.log('board after update:', board.groups[gIdx])
    console.log(
      userService.getLoggedinUser() +
        ' updated the ' +
        key +
        ' of task ' +
        board.groups[gIdx].tasks[tIdx].title +
        ' in ' +
        board.groups[gIdx].title +
        ' to ' +
        value
    )
  } else if (gIdx !== -1 && tIdx === -1) {
    activity = boardService.createActivityLog(
      board._id,
      group.id,
      null,
      key,
      value,
      board.groups[gIdx][key]
    )

    board.groups[gIdx][key] = value

    board.activities.unshift(activity)
    userMsg = 'Group updated successfully'
    console.log(
      userService.getLoggedinUser() +
        ' updated the ' +
        key +
        ' of group ' +
        board.groups[gIdx].title +
        ' in ' +
        board.groups[gIdx].title +
        ' to ' +
        value
    )
  } else {
    activity = boardService.createActivityLog(
      board._id,
      null,
      null,
      key,
      value,
      board[key]
    )
    board[key] = value
    board.activities.unshift(activity)
    userMsg = 'Board updated successfully'
    console.log(
      userService.getLoggedinUser() +
        ' updated the ' +
        key +
        ' of board ' +
        board.title +
        ' to ' +
        value
    )
  }

  try {
    await saveBoard(board)
  } catch (err) {
    console.error('Failed to save the board:', err)
    throw err
  }
}
