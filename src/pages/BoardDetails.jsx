import { BoardHeader } from "../cmps/BoardHeader";
import { GroupPreview } from "../cmps/GroupPreview";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadBoards } from "../store/boards/boards.actions.js";

export function BoardDetails() {
  const allBoards = useSelector((state) => state.boardsModule.boards);

  useEffect(() => {
    if (!allBoards || allBoards.length === 0) loadBoards();
  });

  //board-header
  console.log(allBoards);

  if (!allBoards || allBoards.length === 0) return <div>Loading...</div>;
  return (
    <div className="main-container">
      <BoardHeader board={allBoards[0]} />
      {allBoards[0].groups &&
        allBoards[0].groups.map((group) => (
          <GroupPreview
            group={group}
            labels={allBoards[0].labels}
            key={group.id}
          />
        ))}
    </div>

    // Ofir & Yuval
    // <>
    // <BoardHeader board={board}/>
    // {groups && groups.map(group => <GroupPreview group={group} board={board} key={group._id}/>)}

    // <button>add group</button>
    // </>
  );
}
