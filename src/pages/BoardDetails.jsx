import { useSelector } from 'react-redux';
import { BoardHeader } from '../cmps/board/BoardHeader';
import { GroupPreview } from '../cmps/group/GroupPreview';
import { useEffect, useRef, useState } from 'react';
import {
	addTask,
	updateBoard,
	duplicateTask,
	removeMultipleTasks,
	moveMultipleTasksIntoSpecificGroup,
	duplicateMultipleTasks,
	logActivity,
	setFilterBy,
  loadBoard,
} from '../store/board/board.actions';
import { showErrorMsg } from '../services/event-bus.service';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { boardService } from '../services/board.service';
import { useParams, Outlet, useSearchParams } from 'react-router-dom';
import { utilService, getSvg, debounce, getExistingProperties } from '../services/util.service';
import CloseIcon from '@mui/icons-material/Close';
import { useEffectUpdate } from "../customHooks/useEffectUpdate";
import * as XLSX from 'xlsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
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

const SvgIcon = ({ iconName, options }) => {
	return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>;
};

export function BoardDetails() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { boardId } = useParams();
	const board = useSelector((storeState) => storeState.boardModule.currentBoard);
	const filterBy = useSelector((storeState) => storeState.boardModule.filterBy);
	const onSetFilterByDebounce = useRef(debounce(onSetFilterBy, 400)).current;
	const [activeTask, setActiveTask] = useState() // drag and drop
	const sensors = useSensors(
	  useSensor(PointerSensor, {
		activationConstraint: {
		  distance: 5, // only if moved 5px trigger , allowing buttons and stuff to work (since they're insta click)
		},
	  })
	)
  const [checkedTasksList, setCheckedTasksList] = useState([])

  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
	setFilterBy(boardService.getFilterFromSearchParams(searchParams));
	onLoadBoard();
}, []);

useEffectUpdate(() => {
	onLoadBoard();
	setSearchParams(getExistingProperties(filterBy));
}, [filterBy]);

function onSetFilterBy(filterBy) {
	setFilterBy(filterBy);
}

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget); // Set the clicked element as the anchor
	};

	const handleClose = () => {
		setAnchorEl(null); // Close the menu
	};

	async function onLoadBoard() {
		try {
      await loadBoard(boardId)
		} catch (error) {
			showErrorMsg('Cannot load boards');
			console.error(error);
		}
	}

  if (!board) return <div>Loading...</div>

	function onAddTask(group, initialTitle = 'New Task', fromHeader) {
		const newTask = { id: utilService.makeId(), title: initialTitle };
		addTask(board, group, newTask, fromHeader);
	}

  const onAddGroup = async (fromHeader) => {
    if (!board) return
    let newGroup = boardService.getEmptyGroup()
    newGroup = {
      id: 'g' + utilService.makeId(), // Generate and add ID to the top of the properties

			...newGroup,
		};
		const updatedGroups = fromHeader ? [newGroup, ...board?.groups] : [...board?.groups, newGroup];

    updateBoard(null, null, { key: 'groups', value: updatedGroups })
    logActivity(newGroup, null, null, 'groupCreated')
  }
  const handleTasksChecked = (newArrayOfTasks, action) => {
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
		// reducer that returns a Map of [color : checkedTaskObj] so the checked taskss will be grouped together when selected
		return tasks.reduce((groups, task) => {
			if (!groups[task.groupColor]) {
				groups[task.groupColor] = [];
			}
			groups[task.groupColor].push(task);
			return groups;
		}, {});
	}

	const handleFooterAction = async (action, groupTargetId) => {
		switch (action) {
			case 'duplicate':
				duplicateMultipleTasks(board, checkedTasksList);
				handleTasksChecked(checkedTasksList, 'delete'); // to clean checkboxes after action is done
				break;
			case 'export':
				console.log('CLicked');
				break;
			case 'archive':
				console.log('CLicked');
				break;
			case 'delete':
				handleTasksChecked(checkedTasksList, 'delete');
				removeMultipleTasks(board, checkedTasksList); // TODO: get return value and check if user confirmed he wants to delete tasks
				break;
			case 'convert':
				console.log('CLicked');
				break;
			case 'move_to':
				await moveMultipleTasksIntoSpecificGroup(board, checkedTasksList, groupTargetId);
				handleTasksChecked(checkedTasksList, 'delete');
				break;
			case 'apps':
				console.log('CLicked');

        break
      default:
        console.warn(`Unknown action: ${action}`)
    }
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
    console.log('active ', active)
    console.log('over ', over)

    if (!over || !active) return

    const activeTask = board.groups
      .flatMap((group) => group.tasks)
      .find((task) => task.id === active.id)

    let activeContainer = findContainerByTaskId(active.id)
    let overContainer = findContainerByTaskId(over.id)

    if (!activeContainer || !overContainer) {
      overContainer = board.groups.find((group) => group.id === over.id)
      console.log(overContainer)

      if (overContainer.tasks.length == 1) {
        over = { id: overContainer.tasks[0].id }
      } else if (overContainer.collapsed && overContainer.tasks.length > 0)
        over = { id: overContainer.tasks[0].id }
      else if (overContainer.tasks.length != 0) return
    }

    let activeIndex = activeContainer?.tasks?.findIndex((task) => task.id === active.id)
    let overIndex = overContainer?.tasks?.findIndex((task) => task.id === over.id)
    if (overIndex == -1) overIndex = 0

    if (activeContainer.id === overContainer.id) {
      // if same container swap elements inside
      const updatedGroupAfterSwap = swapArrayElements(activeContainer.tasks, activeIndex, overIndex)

      updateBoard(activeContainer.id, null, { key: 'tasks', value: updatedGroupAfterSwap })
      return
    }

    activeContainer.tasks = activeContainer.tasks.filter((task) => task.id !== active.id)
    overContainer.tasks = [
      ...overContainer.tasks.slice(0, overIndex),
      activeTask,
      ...overContainer.tasks.slice(overIndex),
    ]

    updateBoard(activeContainer.id, null, { key: 'tasks', value: activeContainer.tasks })
    updateBoard(overContainer.id, null, { key: 'tasks', value: overContainer.tasks })
    return
  }

  function handleDragEnd(event) {
    const { active } = event
    const destinationGroup = findContainerByTaskId(active.id)
    logActivity(destinationGroup, active, null, 'movedTo')
    setActiveTask(null)
    return
  }

  ///////////////////

  return (
    <div className='board-details-container'>
      <div className='board-details-header'>
        <BoardHeader onSetFilterBy={onSetFilterByDebounce} filterBy={filterBy} board={board} onAddTask={onAddTask} onAddGroup={onAddGroup} />
      </div>
      <div className='board-details-groups-container'>
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          {board.groups &&
            board.groups.map((group) => (
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

          <DragOverlay>{activeTask ? <Item item={activeTask} /> : null}</DragOverlay>
        </DndContext>
        <div className='add-group-button-container'>
          <Button
            variant='outlined'
            onClick={() => onAddGroup(false)}
            sx={{
              color: 'black',
              borderColor: 'gray',
              textTransform: 'none',
            }}
          >
            Add new group
          </Button>
        </div>
      </div>
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
                {Object.entries(groupCheckedTasksByColor(checkedTasksList)).flatMap(
                  ([color, tasks]) =>
                    tasks.slice(0, 13).map((_, idx) => (
                      <span key={`${color}-${idx}`} style={{ color }}>
                        •
                      </span>
                    ))
                )}
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
									}}>
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
										}}></div>
									{board?.groups?.map((group) => (
										<DropdownMenu.Item
											onClick={() => handleFooterAction('move_to', group.id)}
											className='dropdown-item'
											key={group.id}>
											{group.title}
										</DropdownMenu.Item>
									))}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>

						<div
							className='footer_option'
							onClick={() => {
								handleFooterAction('apps');
							}}>
							<SvgIcon iconName='apps'></SvgIcon>
							<span>Apps</span>
						</div>
					</div>
					<span
						style={{
							borderLeft: '2px solid gray',
							opacity: 0.4,
							marginLeft: '15px',
						}}></span>
					<IconButton
						className='footer_close-icon_container'
						sx={{
							borderRadius: '2px',
							'&:hover': { backgroundColor: 'white' },
						}}
						onClick={() => {
							setCheckedTasksList([]);
						}}>
						<CloseIcon className='footer_close-icon' />
					</IconButton>
				</div>
			</div>
			<Outlet context={boardId} />
		</div>
	);
}
