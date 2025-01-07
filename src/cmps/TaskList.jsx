import { AddTask } from './AddTask'
import { GroupSummary } from './GroupSummary'
import { TaskPreview } from './TaskPreview'

export function TaskList(group, board) {
	// table

	return (
		<>
			<table>
				<th>
					// th - labels including checkbox
					{group.labels.map((label) => (
						<td key={label._id} style={{ backgroundColor: label.color }}>
							{label.title}
						</td>
					))}
				</th>
				{/*  map tasks -> tr - task preview */}
				{group.tasks.map((task) => (
					<tr key={task._id}>
						{task.map((key) => <td key={task._id+key}>{task[key]}</td> )}
					</tr>
				))}
				<tr>
					// last tr-1 - add task
					<AddTask group={group} />
				</tr>
				<tr>
					// last tr - group summary
                    {/* TODO - IMPLEMENT SUMMARY */}
					<GroupSummary group={group} />
				</tr>
			</table>
		</>
	)
}
