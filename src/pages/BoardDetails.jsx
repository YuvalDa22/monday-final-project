import { useSelector } from 'react-redux'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { GroupPreview } from '../cmps/group/GroupPreview'
import { useEffect,useState } from 'react'
import { loadBoards } from '../store/board/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { Button,IconButton } from '@mui/material'
import { updateBoard } from '../store/board/board.actions'
import { boardService } from '../services/board.service'
import { useParams, Outlet } from 'react-router-dom'
import { utilService,getSvg } from '../services/util.service'



const SvgIcon = ({ iconName, options }) => {
  return <i dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
}

export function BoardDetails() {
  const { boardId } = useParams()
  const allBoards = useSelector((storeState) => storeState.boardModule.boards)
  const board = allBoards.find((board) => board._id === boardId)
  const [checkedTasksList, setCheckedTasksList] = useState([])


  useEffect(() => {
    onLoadBoards()
  }, [])

  async function onLoadBoards() {
    try {
      await loadBoards()
    } catch (error) {
      showErrorMsg('Cannot load boards')
      console.error(error)
    }
  }

  if (!allBoards || allBoards.length === 0) return <div>Loading...</div>

  const onAddGroup = () => {
    if (!board) return
    let newGroup = boardService.getEmptyGroup()
    newGroup = {
      id: utilService.makeId(), // Generate and add ID to the top of the properties
      ...newGroup,
    }

    const updatedGroups = [...board?.groups, newGroup]
    updateBoard(board, null, null, { key: 'groups', value: updatedGroups })
    console.log(board, ' UPDATD BOARD')
  }



  const handleTasksChecked = (newArrayOfTasks,action) => {
    if (action === 'add')
    {
      setCheckedTasksList(prev => [...prev,...newArrayOfTasks])
    }
      else{
        // Here we remove tasks from the array of checked-tasks
        // So we go through all the tasks and if the a task appears SOMEWHERE in newArrayOfTasks , it should be filtered out
        const filteredTasks = checkedTasksList.filter((taskInList) => 
          !newArrayOfTasks.some((newTask) => 
            newTask.groupId === taskInList.groupId && newTask.taskId === taskInList.taskId
          )
        );
        setCheckedTasksList(filteredTasks);
        
      }

    
  };

  return (
    <>
      <div className='board-details-container'>
        <div className='board-details-header'>
          <BoardHeader board={board} />
        </div>
        <div className='board-details-groups-container'>
          {board?.groups &&
            board?.groups.map((group) => (
              <GroupPreview
                board={board}
                group={group}
                cmpTitles={board.cmpTitles}
                cmpsOrder={board.cmpsOrder}
                key={group.id}
                onTasksCheckedChange={handleTasksChecked}
              />
            ))}
          <div className='add-group-button-container'>
            <Button
              variant='outlined'
              onClick={onAddGroup}
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
        <div className={`board-details_footer ${checkedTasksList.length > 0 ? "show_footer" : "hide_footer"}`}>
           <div className="footer_blue-number">
           <span>{checkedTasksList.length}</span>
           </div>
           <div className={'footer_rest-of-footer'}>
           <div className="footer_item-selected_container">
            <div>
              <span>{checkedTasksList.length>1?"Items":"Item"} selected</span>
            </div>
            <div>
                  <span className='footer_colored-dots'>{checkedTasksList.map((task)=>('.'))}</span>
            </div>
           </div>
           <div className='footer_options_container'>
           <div className='footer_option'>
              <SvgIcon iconName="duplicate"></SvgIcon>
              <span>Duplicate</span>
           </div>
           <div className='footer_option'>
              <SvgIcon iconName="export"></SvgIcon>
              <span>Export</span>
           </div>
           <div className='footer_option'>
              <SvgIcon iconName="archive"></SvgIcon>
              <span>Archive</span>
           </div>
           <div className='footer_option'>
              <SvgIcon iconName="delete"></SvgIcon>
              <span>Delete</span>
           </div>
           <div className='footer_option'>
              <SvgIcon iconName="convert"></SvgIcon>
              <span>Convert</span>
           </div>
           <div className='footer_option'>
              <SvgIcon iconName="move_to"></SvgIcon>
              <span>Move to</span>
           </div>
           <div className='footer_option'>
              <SvgIcon iconName="apps"></SvgIcon>
              <span>Apps</span>
           </div>
          
           </div>
           <IconButton sx={{borderLeft:"2px solid gray",borderRadius:'0px',opacity:0.4,display:'flex',width:"62px",textAlign:'center'}}>
             X
           </IconButton>

           </div>
      </div>
        <Outlet context={boardId} /> {/* Task Details ! */}
      </div>
    </>
  )
}
