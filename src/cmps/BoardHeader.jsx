import { AdditionalBoardActions } from "./AdditionalBoardActions";
import { BoardActionsBar } from "./BoardActionsBar";
import { BoardNavBar } from "./BoardNavBar";

// Note : We can ignore the props validation error for now
export function BoardHeader({ board }) {
  return (
    <>
      {/*TODO: remove inline style */}
      <h1 style={{ marginBottom: 30 }}>{board.title}</h1>{" "}
      {/* <AdditionalBoardActions /> */}
      {/* <BoardNavBar/> */}
      {/* <BoardActionsBar />  */}
    </>
  );
}
