import { useSelector } from 'react-redux'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { GroupPreview } from '../cmps/group/GroupPreview'
import { useEffect, useRef, useState } from 'react'
import {
  addTask,
  updateBoard,
  duplicateTask,
  removeMultipleTasks,
  moveMultipleTasksIntoSpecificGroup,
  duplicateMultipleTasks,
  getBoardById,
  logActivity,
  getGroupByTaskId,
  loadBoards,
  getTaskById,
} from '../store/board/board.actions'
import { Heading, Icon as IconVibe } from '@vibe/core'
import { Add } from '@vibe/icons'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import { boardService } from '../services/board'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { utilService, getSvg, debounce } from '../services/util.service'
import CloseIcon from '@mui/icons-material/Close'
import * as XLSX from 'xlsx'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensors,
  useSensor,
  PointerSensor,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Item } from '../../src/cmps/group/GroupItemContainer'
import { socketService } from '../services/socket.service'
import { LoadingSpinner } from '../cmps/LoadingSpinner'

const SvgIcon = ({ iconName, options }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}

export function BoardDetails() {
  const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
  const { boardId } = useParams()
  const user = useSelector((storeState) => storeState.userModule.user)
  const isLoading = useSelector((storeState) => storeState.boardModule.isLoading)
  const navigate = useNavigate()
  const currentBoard = useSelector((storeState) => storeState.boardModule.currentBoard)
  const board = useSelector((storeState) => {
    const currentBoard = storeState.boardModule.currentBoard
    return currentBoard ? boardService.filterBoard(currentBoard, filterBy) : null
  })
  let pendingUpdates = [] // Stores updates until dragEnd
  const [loading, setLoading] = useState(true)

  const [activeTask, setActiveTask] = useState() // drag and drop
  const [checkedTasksList, setCheckedTasksList] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // only if moved 5px trigger , allowing buttons and stuff to work (since they're insta click)
      },
    })
  )

  useEffect(() => {
    onLoadBoard()
  }, [boardId, filterBy])

  useEffect(() => {
    loadBoards()
  }, [boardId])

  useEffect(() => {
    if (boardId) {
      socketService.emit('join-board', boardId)
    }

    socketService.on('board-updated', (boardId) => {
      onLoadBoard()
    })
    return () => {
      socketService.emit('leave-board', boardId)
      socketService.off('board-updated')
    }
  }, [boardId])

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }
  const onSetFilterByDebounce = useRef(debounce(onSetFilterBy, 400)).current

  async function onLoadBoard() {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for 1 seconds
      await getBoardById(boardId)
    } catch (error) {
      showErrorMsg('Cannot load board')
      console.error(error)
    }
  }

  function onAddTask(group, initialTitle = 'New Task', fromHeader) {
    try {
      const newTask = { id: utilService.makeId(), title: initialTitle }
      addTask(board, group, newTask, fromHeader)
      showSuccessMsg('Task added successfully')
    } catch (err) {
      showErrorMsg('Failed to add task')
      console.error(err)
    }
  }

  const onAddGroup = async (fromHeader) => {
    try {
      if (!board) return
      let newGroup = boardService.getEmptyGroup()
      const updatedGroups = fromHeader ? [newGroup, ...board?.groups] : [...board?.groups, newGroup]
      await updateBoard(
        null,
        null,
        { key: 'groups', value: updatedGroups },
        { action: 'groupCreated' }
      )
      showSuccessMsg('Group added successfully')
    } catch (err) {
      showErrorMsg('Failed to add group')
      console.error(err)
    }
  }

  const   handleFooterAction = async (action, groupTargetId) => {
    try {
      switch (action) {
        case 'duplicate':
          await duplicateMultipleTasks(board, checkedTasksList)
          handleTasksChecked(checkedTasksList, 'add')
          showSuccessMsg('Tasks duplicated successfully')
          break
        case 'delete':
          await removeMultipleTasks(board, checkedTasksList)
          handleTasksChecked(checkedTasksList, 'delete')
          showSuccessMsg('Tasks deleted successfully')
          break
        case 'move_to':
          await moveMultipleTasksIntoSpecificGroup(board, checkedTasksList, groupTargetId)
          handleTasksChecked(checkedTasksList, 'delete')
          showSuccessMsg('Tasks moved successfully')
          break
        default:
          console.warn(`Unknown action: ${action}`)
      }
    } catch (err) {
      showErrorMsg('Failed to perform action')
      console.error(err)
    }
  }

  function handleTasksChecked(newArrayOfTasks, action) {
    if (action === 'add') {
      setCheckedTasksList((prev) => {
        // first combine existing and new tasks
        const combined = [...prev, ...newArrayOfTasks]
        // then remove duplicates
        return combined.filter(
          (task, index, self) =>
            index === self.findIndex((t) => t.groupId === task.groupId && t.taskId === task.taskId)
        )
      })
    } else {
      // Here we remove tasks from the array of checked-tasks
      // So we go through all the tasks and if a task appears SOMEWHERE in newArrayOfTasks , it should be filtered out
      const filteredTasks = checkedTasksList.filter(
        (taskInList) =>
          !newArrayOfTasks.some(
            (newTask) =>
              newTask.groupId === taskInList.groupId && newTask.taskId === taskInList.taskId
          )
      )
      setCheckedTasksList(filteredTasks)
    }
  }

  function groupCheckedTasksByColor(tasks) {
    return tasks.reduce((groups, task) => {
      const color = getGroupByTaskId(task.taskId).style.color

      if (!groups[color]) {
        groups[color] = []
      }
      groups[color].push(task)
      return groups
    }, {})
  }

  ///////////////////

  function swapArrayElements(arr, index1, index2) {
    const newArr = [...arr] //  Create a copy to avoid mutating state

    // Swap elements
    ;[newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]]

    return newArr //  Return new array with swapped positions
  }

  function findContainerByTaskId(id) {
    return board.groups.find((group) => group.tasks.some((task) => task.id === id))
  }

  function handleDragStart(event) {
    const { active } = event
    setCheckedTasksList([]) // clear checked tasks when dragging item
    if (!active?.id) return

    // Find the task object based on active.id
    const activeTask = board.groups
      .flatMap((group) => group.tasks)
      .find((task) => task.id === active.id)
    setActiveTask(activeTask)
  }

  function handleDragOver(event) {
    let { active, over } = event
    if (!over || !active) return

    const activeTask = board.groups
      .flatMap((group) => group.tasks)
      .find((task) => task.id === active.id)

    let activeContainer = findContainerByTaskId(active.id)
    let overContainer = findContainerByTaskId(over.id)

    if (!activeContainer || !overContainer) {
      overContainer = board.groups.find((group) => group.id === over.id)

      if (overContainer.tasks.length === 1) {
        over = { id: overContainer.tasks[0].id }
      } else if (overContainer.collapsed && overContainer.tasks.length > 0) {
        over = { id: overContainer.tasks[0].id }
      } else if (overContainer.tasks.length !== 0) return
    }

    let activeIndex = activeContainer.tasks.findIndex((task) => task.id === active.id)
    let overIndex = overContainer.tasks.findIndex((task) => task.id === over.id)
    if (overIndex === -1) {
      overIndex = overContainer.tasks.length // Place at the end if no valid `over.id`
    }
    if (activeContainer.id === overContainer.id) {
      // move the task under the task it's hovering over
      const [movedTask] = activeContainer.tasks.splice(activeIndex, 1)
      activeContainer.tasks.splice(overIndex, 0, movedTask)

      pendingUpdates = [{ groupId: activeContainer.id, key: 'tasks', value: activeContainer.tasks }]
      return
    }

    if (overIndex > 0) overIndex++ // Fix for placing at bottom

    if (activeContainer.id !== overContainer.id) {
      // Remove task from original container
      activeContainer.tasks = activeContainer.tasks.filter((task) => task.id !== active.id)

      overContainer.tasks.splice(overIndex, 0, activeTask)
    }

    updateBoard(activeContainer.id, null, {
      key: 'tasks',
      value: activeContainer.tasks,
    })
    updateBoard(overContainer.id, null, {
      key: 'tasks',
      value: overContainer.tasks,
    })
  }

  function handleDragEnd(event) {
    const { active } = event
    const destinationGroup = findContainerByTaskId(active.id)

    // Apply all pending updates at once
    pendingUpdates.forEach(({ groupId, key, value }) => {
      updateBoard(groupId, null, { key, value })
    })

    // Clear pending updates after applying them
    pendingUpdates = []

    setActiveTask(null)
  }

  ///////////////////
  if (!board) return <LoadingSpinner />
  return (
    <div className='board-details-container'>
      <div className='board-details-header'>
        <BoardHeader
          board={board}
          onAddTask={onAddTask}
          onAddGroup={onAddGroup}
          filterBy={filterBy}
          onSetFilterBy={onSetFilterByDebounce}
          currentBoard={currentBoard}
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : board.groups && board.groups.length ? (
        <div className='board-details-groups-container'>
          <DndContext
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            {board?.groups.map((group) => (
              <GroupPreview
                board={board}
                group={group}
                cmpTitles={board.cmpTitles}
                cmpsOrder={board.cmpsOrder}
                key={group.id}
                onTasksCheckedChange={handleTasksChecked}
                checkedTasksList={checkedTasksList}
                onAddTask={onAddTask}
              />
            ))}
            <DragOverlay>
              {activeTask ? (
                <Item
                  item={activeTask}
                  board={board}
                  group={getGroupByTaskId(activeTask.id)}
                  cmpsOrder={board.cmpsOrder}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
          <div className='add-group-button-container'>
            <Button
              variant='outlined'
              onClick={() => onAddGroup(false)}
              sx={{
                color: '#323338 !important',
                borderColor: '#c4c6d4',
                whiteSpace: 'nowrap',
                textTransform: 'none',
                padding: '0px !important',
                fontSize: '14px',
                height: '32px',
                justifyContent: 'center',
                width: '142.09px',
                marginLeft: '42px',
                marginTop: '-50px',
                fontWeight: '200 !important',
                fontFamily:
                  'Figtree, Roboto, Noto Sans Hebrew, Noto Kufi Arabic, Noto Sans JP, sans-serif',
              }}
            >
              <div className='div-in-button'>
                <IconVibe
                  icon={Add}
                  iconSize={20}
                  style={{ flexShrink: 0, top: '5px', margin: '0px 5px' }}
                  //   className="add-group-button-add-icon" marginRight: '6px'
                />
                Add new group
              </div>
            </Button>
          </div>
        </div>
      ) : (
        <div className='no-groups-container'>
          <img
            src='https://res.cloudinary.com/ofirgady/image/upload/v1742631862/je9sa8d5amvpuykzdcxq.svg'
            alt='empty board'
            style={{ width: '200px', height: '230px' }}
          />
          <Heading type='h2'>No results were found</Heading>
        </div>
      )}
      <div
        className={`board-details_footer ${
          checkedTasksList.length > 0 ? 'show_footer' : 'hide_footer'
        }`}
      >
        <div className='footer_blue-number'>
          <span>{checkedTasksList.length}</span>
        </div>
        <div className={'footer_rest-of-footer'}>
          <div className='footer_item-selected_container'>
            <div>
              <span>{checkedTasksList.length > 1 ? 'Items' : 'Item'} selected</span>
            </div>
            <div>
              <div className='footer_colored-dots'>
                {(() => {
                  let totalRendered = 0 // used to keep track of how many tasks we rendered so we max render 13

                  return Object.entries(groupCheckedTasksByColor(checkedTasksList)).flatMap(
                    ([color, tasks]) => {
                      const remainingSlots = 13 - totalRendered
                      if (remainingSlots <= 0) return []

                      const tasksToRender = tasks.slice(0, remainingSlots)
                      totalRendered += tasksToRender.length

                      return tasksToRender.map((_, idx) => (
                        <span key={`${color}-${idx}`} style={{ color }}>
                          •
                        </span>
                      ))
                    }
                  )
                })()}

                {checkedTasksList.length > 13 && (
                  <span style={{ fontSize: '11px' }}> + {checkedTasksList.length - 13}</span>
                )}
              </div>
            </div>
          </div>
          <div className='footer_options_container'>
            <div
              className='footer_option'
              onClick={() => {
                handleFooterAction('duplicate')
              }}
            >
              <SvgIcon iconName='duplicate'></SvgIcon>
              <span>Duplicate</span>
            </div>
            <div
              className='footer_option'
              onClick={() => {
                handleFooterAction('export')
              }}
            >
              <SvgIcon iconName='export'></SvgIcon>
              <span>Export</span>
            </div>
            <div
              className='footer_option'
              onClick={() => {
                handleFooterAction('archive')
              }}
            >
              <SvgIcon iconName='archive'></SvgIcon>
              <span>Archive</span>
            </div>
            <div
              className='footer_option'
              onClick={() => {
                handleFooterAction('delete')
              }}
            >
              <SvgIcon iconName='delete'></SvgIcon>
              <span>Delete</span>
            </div>
            <div
              className='footer_option'
              onClick={() => {
                handleFooterAction('convert')
              }}
            >
              <SvgIcon iconName='convert'></SvgIcon>
              <span>Convert</span>
            </div>
            <div className='footer_option'>
              <DropdownMenu.Root sx={{ backgroundColor: 'red' }}>
                <DropdownMenu.Trigger asChild>
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <SvgIcon iconName='move_to'></SvgIcon>
                    <span>Move to</span>
                  </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                  className='fade-in-up' // animation like monday
                  style={{
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '8px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                  }}
                >
                  <div
                    // this is for the triangle that points down , at the bottom of the menu
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '0',
                      height: '0',
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid white',
                    }}
                  ></div>
                  {board?.groups?.map((group) => (
                    <DropdownMenu.Item
                      onClick={() => handleFooterAction('move_to', group.id)}
                      className='dropdown-item'
                      key={group.id}
                    >
                      {group.title}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </div>

            <div
              className='footer_option'
              onClick={() => {
                handleFooterAction('apps')
              }}
            >
              <SvgIcon iconName='apps'></SvgIcon>
              <span>Apps</span>
            </div>
          </div>
          <span
            style={{
              borderLeft: '2px solid gray',
              opacity: 0.4,
              marginLeft: '15px',
            }}
          ></span>
          <IconButton
            className='footer_close-icon_container'
            sx={{
              borderRadius: '2px',
              '&:hover': { backgroundColor: 'white' },
            }}
            onClick={() => {
              setCheckedTasksList([])
            }}
          >
            <CloseIcon className='footer_close-icon' />
          </IconButton>
        </div>
      </div>
      <Outlet context={boardId} />
    </div>
  )
}
