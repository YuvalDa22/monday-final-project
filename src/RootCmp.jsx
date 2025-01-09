import { Routes, Route, useLocation } from 'react-router-dom'
import './assets/styles/styles.scss'
import { UserMsg } from './cmps/Usermsg'
import { Login } from './pages/Login'
import { HomePage } from './pages/HomePage'
import { SignUp } from './pages/SignUp'
import { MondayIndex } from './pages/MondayIndex'
import SideBar from './cmps/layout/SideBar'
import { BoardDetails } from './pages/BoardDetails'
import  NavBar   from './cmps/layout/NavBar'
import { BoardsIndex } from './pages/BoardsIndex'
import { TaskDetails } from './pages/TaskDetails'

function RootCmp() {
  const location = useLocation()
  const showSidebarAndNavBar = location.pathname.startsWith('/workspace')
  return (
    <div>
      {showSidebarAndNavBar && <SideBar />}
      {showSidebarAndNavBar && <NavBar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* <Route path='workspace/board' element={<BoardsIndex />} /> */}
        <Route path='workspace/board/:boardId' element={<BoardDetails />} />
        {/* <Route path='workspace/board/:boardId/task/:taskId' element={<TaskDetails />} /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/index' element={<MondayIndex />} />
      </Routes>
      
      <UserMsg />
    </div>
  )
}

export default RootCmp
