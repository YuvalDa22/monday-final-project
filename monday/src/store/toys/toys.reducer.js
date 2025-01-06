export const SET_TOYS = 'SET_TOYS'
export const REMOVE_TOY = 'REMOVE_TOY'
export const ADD_TOY = 'ADD_TOY'
export const EDIT_TOY = 'EDIT_TOY'
export const SET_FILTER = 'SET_FILTER'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
  toys: [],
  filterBy: {},
  isLoading: true,
}

export function toysReducer(state = initialState, cmd) {
  switch (cmd.type) {
    case SET_TOYS:
      return {
        ...state,
        toys: cmd.toys,
      }
    case REMOVE_TOY:
      return {
        ...state,
        toys: state.toys.filter((toy) => toy.id !== cmd.toyId),
      }
    case ADD_TOY:
      return {
        ...state,
        toys: [...state.toys, cmd.toys],
      }
    case EDIT_TOY:
      return {
        ...state,
        toys: state.toys?.map((toy) => (toy.id === cmd.toy.id ? cmd.toy : toy)),
      }

    case SET_FILTER:
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
