// import { AddTask } from './AddTask'
// import { GroupSummary } from './GroupSummary'
// import { TaskPreview } from './TaskPreview'

import { useSelector } from "react-redux";
import { TaskPreview } from "../task/TaskPreview";

export function TaskList({ group, cmpTitles, cmpsOrder }) {


  // table

  return (
    <div>
      <table className="custom-table">
        <tbody>
          <tr>
            <td className="empty-cell"></td>
            {cmpTitles.map((title, index) => (
              <td key={index} className="header-cell">
                {title}
              </td>
            ))}
          </tr>

          {group.tasks.map((task) => (
            <tr key={task._id}>
              <td className="task-cell">{task.title}</td>
                <TaskPreview task={task} cmpsOrder={cmpsOrder} />
            </tr>
          ))}

        {/* <tr> */}
					{/* last tr-1 - add task */}
					{/* <AddTask group={group} /> */}
				{/* </tr> */}
				{/* <tr> */}
					{/* last tr - group summary */}
          {/* TODO - IMPLEMENT SUMMARY */}
					{/* <GroupSummary group={group} /> */}
				{/* </tr> */}

        </tbody>
      </table>
    </div>
  );
}

