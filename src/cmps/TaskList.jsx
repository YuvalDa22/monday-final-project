// import { AddTask } from './AddTask'
// import { GroupSummary } from './GroupSummary'
// import { TaskPreview } from './TaskPreview'

export function TaskList({ group, labels }) {
  // table

  return (
    <div>
      <table className="custom-table">
        <tbody>
          <tr>
            <td className="empty-cell"></td>
            {labels.map((label, index) => (
              <td key={index} className="header-cell">
                {label}
              </td>
            ))}
          </tr>

          {group.tasks.map((task) => (
            <tr key={task.id}>
              <td className="task-cell">{task.title}</td>
              {labels.map((_, index) => (
                <td key={index} className="data-cell"></td>
              ))}
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
