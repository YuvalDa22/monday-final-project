// import { AddTask } from "./AddTask";
import { GroupHeader } from "./GroupHeader";
// import { GroupSummary } from "./GroupSummary";
import { TaskList } from "./TaskList";

export function GroupPreview({ group, cmpTitles, cmpsOrder, board }) {
  
  return (
    <div className="gp-main-container">
      <GroupHeader group={group} />
      <TaskList board={board} group={group} cmpTitles={cmpTitles} cmpsOrder={cmpsOrder} />
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
