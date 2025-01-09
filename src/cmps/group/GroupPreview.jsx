// import { AddTask } from "./AddTask";
import { GroupHeader } from "./GroupHeader";
// import { GroupSummary } from "./GroupSummary";
import { TaskList } from "./TaskList";

export function GroupPreview({ group, cmpTitles }) {
  
  return (
    <div className="gp-main-container">
      <GroupHeader group={group} />
      <TaskList group={group} cmpTitles={cmpTitles} />
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
