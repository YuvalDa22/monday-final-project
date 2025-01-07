import { AdditionalBoardActions } from "./AdditionalBoardActions";
import { BoardActionsBar } from "./BoardActionsBar";
import { BoardNavBar } from "./BoardNavBar";

export function BoardHeader(board) {

    return (
        <>
        <h1>{board.title}</h1>
        <AdditionalBoardActions />
        <BoardNavBar/>
        <BoardActionsBar />
        </>
    )
}