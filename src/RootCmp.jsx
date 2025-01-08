import { Route, Routes, useLocation } from "react-router"
import Navbar from "./cmps/layout/NavBar"
import Sidebar from "./cmps/layout/SideBar"
import { HomePage } from "./pages/HomePage"
import { BoardIndex } from "./pages/BoardIndex"
import { TaskDetails } from "./pages/TaskDetails"
import { BoardDetails } from "./pages/BoardDetails"
import { UserMsg } from "./cmps/UserMsg"
import { MondayIndex } from "./pages/MondayIndex"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"
import './assets/styles/styles.scss'

function RootCmp() {
	const location = useLocation()
	const showSidebarAndNavBar = location.pathname.startsWith('/workspace')
	return (
		<div>
			{showSidebarAndNavBar && <Sidebar />}
			{showSidebarAndNavBar && <Navbar />}
			<Routes>

				<Route path='/' element={<HomePage />} />

				<Route path='/workspace/board' element={<BoardIndex />}>
					  <Route path=':boardId' element={<BoardDetails />}>
						    <Route path='task/:taskId' element={<TaskDetails />} />
					  </Route>
				</Route>

				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/index' element={<MondayIndex />} />
        
			</Routes>

			<UserMsg />
		</div>
	)
}

export default RootCmp
