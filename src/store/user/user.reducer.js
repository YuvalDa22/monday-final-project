import { userService } from '../../services/user.service'

export const SET_USER = 'SET_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'

const initialState = {
  user: userService.getLoggedinUser(),
  users: [],
}

export function userReducer(state = initialState, cmd ) {
  switch (cmd.type) {
    case SET_USER:
      return { ...state, user: cmd.user }
    case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user._id !== cmd.userId),
      }
    case SET_USERS:
      return { ...state, users: cmd.users }
    default:
      return state
  }
}
