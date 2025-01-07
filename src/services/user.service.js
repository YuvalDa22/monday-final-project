import { storageService } from './async-storage.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY_USER_DB = 'user'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,
  update,
  spendBalance,
  getEmptyUser,
}

window.userService = userService

// makeAdminAccount()

// async function makeAdminAccount() {
//   const admin = {
//     username: 'admin',
//     name: 'mr.Admin',
//     password: '123',
//     imgUrl:
//       'https://res.cloudinary.com/danlxus36/image/upload/v1735619252/pexels-pixabay-163036_ucbhhc.jpg',
//     isAdmin: true,
//   }

//   try {
//     const users = (await storageService.query(STORAGE_KEY_USER_DB)) || []

//     if (users.find((user) => user.isAdmin)) {
//       console.log('Admin account already exists.')
//       return
//     }

//     await storageService.post(STORAGE_KEY_USER_DB, admin)
//     console.log('Admin account created successfully.')
//   } catch (error) {
//     console.error('Error checking or creating admin account:', error)
//   }
// }

async function getUsers() {
  return await storageService.query(STORAGE_KEY_USER_DB)
}

async function getById(userId) {
  const user = await storageService.get(STORAGE_KEY_USER_DB, userId)
  return user
}

async function remove(userId) {
  return await storageService.remove(STORAGE_KEY_USER_DB, userId)
}

async function update(userToUpdate) {
  const user = await getById(userToUpdate._id)
  const updatedUser = await storageService.put(STORAGE_KEY_USER_DB, {
    ...user,
    ...userToUpdate,
  })
  if (getLoggedinUser()._id === updatedUser._id) saveLocalUser(updatedUser)
  return updatedUser
}

async function login(userCred) {
  const users = await storageService.query(STORAGE_KEY_USER_DB)
  const user = users.find((user) => user.email === userCred.email)
  if (user) {
    if (user.password === userCred.password) {
      return saveLocalUser(user)
    } else {
      throw new Error('Invalid password')
    }
  } else {
    throw new Error('User not found')
  }
}

async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  const user = await storageService.post(STORAGE_KEY_USER_DB, userCred)
  return saveLocalUser(user)
}

async function logout() {
  return await sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
  return {
    username: '',
    fullname: '',
    password: '',
    imgUrl: '',
    email: '',
  }
}

function saveLocalUser(user) {
  user = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    imgUrl: user.imgUrl,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123', isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123',  isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', isAdmin: false})
// })()
