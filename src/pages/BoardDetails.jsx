import { useSelector } from "react-redux"
import { BoardHeader } from "../cmps/board/BoardHeader"
import { GroupPreview } from "../cmps/group/GroupPreview"
import { useEffect } from "react"
import { loadBoards } from "../store/board/board.actions"


export function BoardDetails() {
	const allBoards = useSelector((storeState) => storeState.boardModule.boards)
	const cmpsOrder = useSelector((storeState) => storeState.boardModule.cmpsOrder)
	useEffect(() => {
		if (allBoards){
			loadBoards()
		} 
	},[])

	if (!allBoards || allBoards.length === 0) return <div>Loading...</div>
	return (
		<>
			<div className='main-container'>
				<BoardHeader board={allBoards[0]} />
				{allBoards[0].groups &&
					allBoards[0].groups.map((group) => (
						<GroupPreview
							group={group}
							cmpTitles={allBoards[0].cmpTitles}
							cmpsOrder = {cmpsOrder}
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
