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

// Add 'Duplicate multiple tasks' func!!
export async function duplicateTask(board, group, task) {
  const newTask = { ...task, id: utilService.makeId(),title: `${task.title} (copy)` };

  // Insert new task below the duplicated one
  const taskIndex = group.tasks.findIndex((t) => t.id === task.id);
  const updatedTasks = [
    ...group.tasks.slice(0, taskIndex + 1),
    newTask,
    ...group.tasks.slice(taskIndex + 1),
  ];

  const newGroup = { ...group, tasks: updatedTasks };

  // Await the asynchronous update
  return updateBoard(board, group, null, { key: 'tasks', value: newGroup.tasks });
}


export async function removeGroup(board, group) {
  const newGroups = board.groups.filter((g) => g.id !== group.id)
  updateBoard(board, null, null, { key: 'groups', value: newGroups })
}

export async function moveMultipleTasksIntoSpecificGroup(board, checkedTasks, targetGroupId) {

  /* Logic here is to grab and isolate the group were gonna move stuff into, and then
     push the tasks that were checked by user into that group while removing them from their original group*/

  // read function removeMultipleTasks for comments about this deep cloning
  let updatedGroups = structuredClone(board.groups);

  // find the target group index in board.groups
  const targetGroupIndex = updatedGroups.findIndex((group) => group.id === targetGroupId);
  if (targetGroupIndex === -1) {
    console.error(`Target group with id ${targetGroupId} not found`);
    return;
  }

  // extract the target group (the one we gonna move tasks into) from the array of all groups
  const targetGroup = { ...updatedGroups[targetGroupIndex], tasks: [...updatedGroups[targetGroupIndex].tasks] };

  // iterate through each task in checkedTasks
  checkedTasks.forEach(({ groupId, taskId }) => {
    const sourceGroupIndex = updatedGroups.findIndex((group) => group.id === groupId);
    if (sourceGroupIndex === -1) {
      console.warn(`Source group with id ${groupId} not found`);
      return;
    }
    // extract the group that contains the task were currently working on in our forEach loop
    const sourceGroup = { ...updatedGroups[sourceGroupIndex], tasks: [...updatedGroups[sourceGroupIndex].tasks] };

    // find the index of the task to move
    const taskIndex = sourceGroup.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) {
      console.warn(`Task with id ${taskId} not found in group ${groupId}`);
      return;
    }

    // remove the task from the source group
    const [taskToMove] = sourceGroup.tasks.splice(taskIndex, 1);

    // add the task to the target group
    targetGroup.tasks.push(taskToMove);

    // update the source group
    updatedGroups[sourceGroupIndex] = sourceGroup;
  });

  // update the target group
  updatedGroups[targetGroupIndex] = targetGroup;


  updateBoard(board, null, null, { key: 'groups', value: updatedGroups });
}


export async function removeMultipleTasks(board,checkedTasks){
  // Todo : Add 'are you sure' and notify caller if user was sure or not about deleting checked tasks

  /* **Reminder**
  checkedTasks look like this : [{groupId: 123 , taskId:456}]*/

  // the logic for deep clone was:
  // if we dont deep clone and only use shallow copy (let updatedGroups = [...board.groups])
  // then the tasks-arrays inside updatedGroups will be the exact tasks as in the redux store..
  // and if we make changes to them , like removing task from group
  // it could cause a change in our board.. which were not supp to do.. TODO: Verify this
  let updatedGroups = structuredClone(board.groups);
  // go through each group in the board
  updatedGroups = updatedGroups.map((group) => {
    // find tasks to remove that belong to the current group
    const tasksToRemove = checkedTasks.filter((checkedTask) => checkedTask.groupId === group.id);

    // if there are tasks to remove from this group
    if (tasksToRemove.length > 0) {
      const updatedTasks = group.tasks.filter(
        (task) =>
          !tasksToRemove.some((checkedTask) => checkedTask.taskId === task.id)
      );

      // Return the updated group with filtered tasks
      return { ...group, tasks: updatedTasks };
    }
    else{ return group;}// If theres no tasks to remove, just return original group
  });
  
  updateBoard(board,null,null,{key:'groups',value:updatedGroups})
  


}

export async function removeTask(board, group, task) {
  // const isConfirmed = window.confirm(
  //   'Are you sure you want to remove this task?'
  // )
  // if (!isConfirmed) return

  console.log(
    'Removing task "' + task.title + '" From group "' + group.title,
    '"'
  )

  store.dispatch({ type: REMOVE_TASK, taskId: task.id })
  const newTasks = group.tasks.filter((t) => t.id !== task.id)
  const newGroup = {
    ...group,
    tasks: newTasks,
  }

  updateBoard(board, group, null, { key: 'tasks', value: newGroup.tasks })
}

export async function addTask(board, group, task) {
  console.log('Adding task "' + task.title + '" To group "' + group.title + '"')

  store.dispatch({
    type: ADD_TASK,
    boardId: board._id,
    groupId: group.id,
    task: task,
  })

  const updatedTasks = [...group.tasks, task]
  updateBoard(board, group, null, { key: 'tasks', value: updatedTasks })
}

export function setFilterBy(filterBy = {}) {
  store.dispatch({ type: SET_FILTER_BY, filterBy })
  console.log('board actions -> filterBy: ', filterBy)
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
