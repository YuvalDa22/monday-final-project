export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const SET_FILTER = 'SET_FILTER'
export const REMOVE_TASK = 'REMOVE_TASK'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const ADD_TASK = 'ADD_TASK'

const initialState = {
	currentBoard: null,
	boards: [],
	filterBy: {},
	isLoading: false,
}

export function boardReducer(state = initialState, cmd) {
	switch (cmd.type) {
		case SET_BOARD:
			return {
				...state,
				currentBoard: { ...cmd.board },
			}
		case SET_BOARDS:
			return {
				...state,
				boards: cmd.boards,
			}
		case REMOVE_BOARD:
			return {
				...state,
				boards: state.boards.filter((board) => board._id !== cmd.boardId),
			}
		case REMOVE_TASK:
			// currently it checks ALL THE BOARDS and ALL THE GROUPS for the task , and filters it out if found
			// board -> group -> tasks -> task
			console.log('Removing task from store')
			return {
				...state,
				boards: state.boards.map((board) => ({
					...board,
					groups: board.groups.map((group) => ({
						...group,
						tasks: group.tasks.filter((task) => task.id !== cmd.taskId),
					})),
				})),
			}
		case ADD_TASK:
			// needs boardId , groupId , and task
			console.log('Adding task to store')
			return {
				...state,
				boards: state.boards.map((board) =>
					board.id === cmd.boardId
						? {
								...board,
								groups: board.groups.map((group) =>
									group.id === cmd.groupId ? { ...group, tasks: [...group.tasks, cmd.task] } : group
								),
						  }
						: board
				),
			}

		case ADD_BOARD:
			return {
				...state,
				boards: [...state.boards, cmd.savedBoard],
			}
		case UPDATE_BOARD:
			return {
				...state,
				boards: state.boards.map((board) => {
					return board._id === cmd.board._id ? { ...cmd.board } : board;
				}),
			};

		case SET_FILTER_BY:
			return {
				...state,
				filterBy: { ...state.filterBy, ...cmd.filterBy },
			}

		case SET_IS_LOADING:
			return {
				...state,
				isLoading: cmd.isLoading,
			}
		default:
			return state
	}
}
