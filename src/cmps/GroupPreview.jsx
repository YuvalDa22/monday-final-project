import { AddTask } from "./AddTask";
import { GroupHeader } from "./GroupHeader";
import { GroupSummary } from "./GroupSummary";
import { TaskList } from "./TaskList";

export function GroupPreview(group, board, key){
    <>
    // group title
    <GroupHeader group={group} />
    // tasks list
    <TaskList group={group} board={board}/>
    </>
}