// import { AddTask } from './AddTask'
// import { GroupSummary } from './GroupSummary'
// import { TaskPreview } from './TaskPreview'

import Input from "@mui/joy/Input";
import { useState } from "react";
import { updateBoard } from "../../store/board/board.actions"
import { TaskPreview } from "../task/TaskPreview";

export function TaskList({ board, group, cmpTitles, cmpsOrder }) {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [tempTitle, setTempTitle] = useState("")

  const handleEdit = (taskId, currentTitle) => {
    setEditingTaskId(taskId)
    setTempTitle(currentTitle) //optimistic UI change
  }

  //save updated task name
  const handleSave = (taskId) => {
    if(tempTitle.trim && tempTitle !== ""){
      updateBoard(board, group.id, taskId, {key: "title", value: tempTitle})
    }
    handleCancel();
  }

  const handleCancel = () => {
    setEditingTaskId(null)
    setTempTitle("")
  }

  return (
    <div>
      <table className="custom-table">
        <thead>
          <tr>
            <td className="empty-cell"></td>
            {cmpTitles.map((title, index) => (
              <td key={index} className="header-cell">
                {title}
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {group.tasks.map((task) => (
            <tr key={task._id}>
              <td className="task-cell">

              {editingTaskId === task.id ? (
                <Input
                type="text"
                value={tempTitle}
                onChange={(event) => setTempTitle(event.target.value)}
                onKeyDown={(event) => {
                  if(event.key === "Enter") handleSave(task.id)
                  if(event.key === "Escape") handleCancel()
                }}
              />
              ) : (
                <span onClick ={()=> handleEdit(task.id, task.title)}>
                  {task.title}
                </span>
              )}
              </td>
              <TaskPreview 
              group={group}
              board={board} 
              task={task} 
              cmpsOrder={cmpsOrder} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

        {/* <tr> */}
					{/* last tr-1 - add task */}
					{/* <AddTask group={group} /> */}
				{/* </tr> */}
				{/* <tr> */}
					{/* last tr - group summary */}
          {/* TODO - IMPLEMENT SUMMARY */}
					{/* <GroupSummary group={group} /> */}
				{/* </tr> */}


