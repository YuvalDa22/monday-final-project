import { useSelector } from "react-redux"
import { BoardHeader } from "../cmps/board/BoardHeader"
import { GroupPreview } from "../cmps/group/GroupPreview"
import { useEffect } from "react"
import { loadBoards } from "../store/boards/boards.actions"


export function BoardDetails() {
	const allBoards = useSelector((storeState) => storeState.boardsModule.boards)

	useEffect(() => {
		if (!allBoards || allBoards.length === 0) loadBoards()
	})

	//board-header
	console.log(allBoards)

	if (!allBoards || allBoards.length === 0) return <div>Loading...</div>
	return (
		<>
			<div className='main-container'>
				<BoardHeader board={allBoards[0]} />
				{allBoards[0].groups &&
					allBoards[0].groups.map((group) => (
						<GroupPreview
							group={group}
							labels={allBoards[0].labels}
							key={group.id}
						/>
					))}
				{/* <button>add group</button> */}
			</div>
		</>
	)

		// Ofir & Yuval
		// <>
		// <BoardHeader board={board}/>
		// {groups && groups.map(group => <GroupPreview group={group} board={board} key={group._id}/>)}

		// <button>add group</button>
		// </>
}
