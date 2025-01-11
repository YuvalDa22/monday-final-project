// import { AddTask } from './AddTask'
// import { GroupSummary } from './GroupSummary'
// import { TaskPreview } from './TaskPreview'

import { TaskPreview } from "../task/TaskPreview";

export function TaskList({ board, group, cmpTitles, cmpsOrder }) {
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
          {group.tasks.map((task, index) => (
            <tr key={task._id}>
              <td key={index} className="task-cell">{task.title}</td>
              <TaskPreview board={board} task={task} cmpsOrder={cmpsOrder} />
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


