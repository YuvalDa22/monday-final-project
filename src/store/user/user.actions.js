import { userService } from '../../services/user.service'
import { store } from '../store'
import { REMOVE_USER, SET_USER, SET_USERS } from './user.reducer'

export async function loadUsers() {
  try {
    const users = await userService.getUsers()
    store.dispatch({ type: SET_USERS, users })
  } catch (err) {
    console.log('user actions -> Cannot load users:', err)
    throw err
  }
}

export async function removeUser(userId) {
  try {
    await userService.remove(userId)
    store.dispatch({ type: REMOVE_USER, userId })
  } catch (err) {
    console.log('user actions -> Cannot remove user:', err)
    throw err
  }
}

export async function updateUser(user) {
  try {
    const updatedUser = await userService.update(user)
    store.dispatch({ type: SET_USER, user: updatedUser })
  } catch (err) {
    console.log('user actions -> Cannot update user:', err)
    throw err
  }
}

export async function login(credentials) {
  try {
    const user = await userService.login(credentials)
    store.dispatch({ type: SET_USER, user })
    return user
  } catch (err) {
    console.log('user actions -> Cannot login:', err)
    throw err
  }
}

export async function signup(credentials) {
  try {
    const user = await userService.signup(credentials)
    store.dispatch({ type: SET_USER, user })
    return user
  } catch (err) {
    console.log('user actions -> Cannot signup:', err)
    throw err
  }
}

export async function logout() {
  try {
    await userService.logout()
    store.dispatch({ type: SET_USER, user: null })
  } catch (err) {
    console.log('user actions -> Cannot logout:', err)
    throw err
  }
}