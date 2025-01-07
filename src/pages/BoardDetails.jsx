import { BoardHeader } from "../cmps/BoardHeader";
import { GroupPreview } from "../cmps/GroupPreview";

export function BoardDetails(){
    //board-header
        return (
            <>
            <BoardHeader board={board}/>
           
            {groups && groups.map(group => <GroupPreview group={group} board={board} key={group._id}/>)}

            <button>add group</button>
            </>
        )



}