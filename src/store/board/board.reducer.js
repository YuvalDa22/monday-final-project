export const SET_BOARDS = 'SET_BOARDS'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const SET_FILTER = 'SET_FILTER'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'
export const SET_FOOTER = 'SET_FOOTER'
export const SET_CHECKED_TASKS = 'SET_CHECKED_TASKS'


const initialState = {
  boards: [],
  filterBy: {},
  isLoading: false,
  footerDisplayed: false,
  checkedTasks: [],
}

export function boardReducer(state = initialState, cmd) {
  switch (cmd.type) {
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
    case ADD_BOARD:
      return {
        ...state,
        boards: [...state.boards, cmd.boards],
      }
    case UPDATE_BOARD:
      return {
        ...state,
        boards: state.boards?.map((board) => (board.id === cmd.board.id ? cmd.board : board)),
      }

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

      case SET_FOOTER:
      return {
        ...state,
        footerDisplayed: cmd.footerDisplayed
      }
      case SET_CHECKED_TASKS:
      return {
        ...state,
        checkedTasks: [
          ...state.checkedTasks.filter((task) => !cmd.checkedTasks.includes(task)),
          ...cmd.checkedTasks
        ],
      }
    default:
      return state
  }
}
