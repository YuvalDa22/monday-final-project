// import { AddTask } from "./AddTask";
import { GroupHeader } from "./GroupHeader";
// import { GroupSummary } from "./GroupSummary";
import { TaskList } from "./TaskList";

export function GroupPreview({ group, labels }) {
  return (
    <div>
      <GroupHeader group={group} />
      <TaskList group={group} labels={labels} />
    </div>
  );
}

// Yuval & Ofir
//     <>
//     // group title
//     <GroupHeader group={group} />
//     // tasks list
//     <TaskList group={group} board={board}/>
//     </>
// }
