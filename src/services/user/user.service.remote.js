import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	login,
	logout,
	signup,
	getUsers,
	getById,
	remove,
	update,
	getLoggedinUser,
	saveLoggedinUser,
}

function getUsers() {
	return httpService.get(`user`)
}

async function getById(userId) {
	const user = await httpService.get(`user/${userId}`)
	return user
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update(userToUpdate) {
	const user = await getById(userToUpdate._id)
	const updatedUser = await httpService.put(`user/${userToUpdate._id}`, {
		...user,
		...userToUpdate,
	})

	// When admin updates other user's details, do not update loggedinUser
	const loggedinUser = getLoggedinUser()
	if (loggedinUser && loggedinUser._id === updatedUser._id) saveLoggedinUser(updatedUser)

	return updatedUser
}

async function login(userCred) {
	const user = await httpService.post('auth/login', userCred)
	if (user) return saveLoggedinUser(user)
	else throw new Error('Invalid login credentials')
}

async function signup(userCred) {
	if (!userCred.imgUrl)
		userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
	userCred.role = 'user'
	userCred.isActive = true
	userCred.isAdmin = false
	userCred.activities = []

	const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = {
		_id: user._id,
		fullname: user.fullname,
		username: user.username,
		email: user.email,
		imgUrl: user.imgUrl,
		role: user.role,
		isActive: user.isActive,
		isAdmin: user.isAdmin,
		activities: user.activities,
	}
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

