import { useSelector } from 'react-redux'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { GroupPreview } from '../cmps/group/GroupPreview'
import { useEffect,useState } from 'react'
import { loadBoards,duplicateTask } from '../store/board/board.actions'
import { showErrorMsg } from '../services/event-bus.service'
import { Button,IconButton } from '@mui/material'
import { updateBoard } from '../store/board/board.actions'
import { boardService } from '../services/board.service'
import { useParams, Outlet } from 'react-router-dom'
import { utilService,getSvg } from '../services/util.service'
import CloseIcon from '@mui/icons-material/Close';



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
    if (action === 'add') {
      setCheckedTasksList((prev) => {
        // first combine existing and new tasks
        const combined = [...prev, ...newArrayOfTasks];
        // then remove duplicates
        return combined.filter(
          (task, index, self) =>
            index ===
            self.findIndex(
              (t) => t.groupId === task.groupId && t.taskId === task.taskId
            )
        );
      });
    }
      else{
        // Here we remove tasks from the array of checked-tasks
        // So we go through all the tasks and if a task appears SOMEWHERE in newArrayOfTasks , it should be filtered out
        const filteredTasks = checkedTasksList.filter((taskInList) => 
          !newArrayOfTasks.some((newTask) => 
            newTask.groupId === taskInList.groupId && newTask.taskId === taskInList.taskId
          )
        );
        setCheckedTasksList(filteredTasks);
        
      }
  };
  
  const handleFooterAction = async (action) => {
      switch (action) {
        case 'duplicate':                
        const allTasks = checkedTasksList.map((checkedTask) =>boardService.getTaskById(checkedTask.groupId,checkedTask.taskId))  
        console.log(allTasks);
        
        for (const [index, task] of allTasks.entries()) {         
          const group = boardService.getGroupById(checkedTasksList[index].groupId);
          await duplicateTask(board, group, task); // Await here to ensure sequential execution
        }
  
          break;
        case 'export':
          console.log("CLicked");
          break;
        case 'archive':
          console.log("CLicked");
          break;
        case 'delete':
          console.log("CLicked");
          break;
        case 'convert':
          console.log("CLicked");
          break;
        case 'move_to':
          console.log("CLicked");
          break;
        case 'apps':
          console.log("CLicked");
          
          break;
        default:
          console.warn(`Unknown action: ${action}`);
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
                checkedTasksList={checkedTasksList}
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
            <span className='footer_colored-dots'>
  {checkedTasksList.length > 13 ? (
    <>
      {'.'.repeat(13)}
      <span style={{fontSize:'11px'}}> + {checkedTasksList.length-13}</span>
    </>
  ) : (
    '.'.repeat(checkedTasksList.length)
  )}
</span>

            </div>
           </div>
           <div className='footer_options_container'>
           <div className='footer_option' onClick={()=>{handleFooterAction("duplicate")}}>
              <SvgIcon iconName="duplicate" ></SvgIcon>
              <span>Duplicate</span>
           </div>
           <div className='footer_option' onClick={()=>{handleFooterAction("export")}}>
              <SvgIcon iconName="export" ></SvgIcon>
              <span>Export</span>
           </div>
           <div className='footer_option' onClick={()=>{handleFooterAction("archive")}}>
              <SvgIcon iconName="archive" ></SvgIcon>
              <span>Archive</span>
           </div>
           <div className='footer_option' onClick={()=>{handleFooterAction("delete")}}>
              <SvgIcon iconName="delete" ></SvgIcon>
              <span>Delete</span>
           </div>
           <div className='footer_option' onClick={()=>{handleFooterAction("convert")}}>
              <SvgIcon iconName="convert" ></SvgIcon>
              <span>Convert</span>
           </div>
           <div className='footer_option' onClick={()=>{handleFooterAction("move_to")}}>
              <SvgIcon iconName="move_to" ></SvgIcon>
              <span>Move to</span>
           </div>
           <div className='footer_option' onClick={()=>{handleFooterAction("apps")}}>
              <SvgIcon iconName="apps" ></SvgIcon>
              <span>Apps</span>
           </div>
          
           </div>
           <span style={{borderLeft:"2px solid gray",borderRadius:'0px',opacity:0.4,marginLeft:10}}></span>
           <IconButton className='footer_close-icon_container' sx={{borderRadius:"2px"}}  onClick={() => {setCheckedTasksList([])}}>
           <CloseIcon className='footer_close-icon'/>
           </IconButton>

           </div>
      </div>
        <Outlet context={boardId} /> {/* Task Details ! */}
      </div>
    </>
  )
}
