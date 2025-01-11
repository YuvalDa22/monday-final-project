import { useSelector } from "react-redux"
import { BoardHeader } from "../cmps/board/BoardHeader"
import { GroupPreview } from "../cmps/group/GroupPreview"
import { useEffect } from "react"
import { loadBoards } from "../store/board/board.actions"
import { showErrorMsg } from "../services/event-bus.service"


export function BoardDetails() {
	const allBoards = useSelector((storeState) => storeState.boardModule.boards)

	useEffect(() => {
		onLoadBoards()
	},[])

	async function onLoadBoards() {
		try {
			await loadBoards();
		} catch (error) {
			showErrorMsg("Cannot load boards");
			console.error(error);
		}
	}

	if (!allBoards || allBoards.length === 0) return <div>Loading...</div>
	return (
		<>
			<div className='main-container'>
				<BoardHeader board={allBoards[0]} />
				{allBoards[0].groups &&
					allBoards[0].groups.map((group) => (
						<GroupPreview
							board={allBoards[0]}
							group={group}
							cmpTitles={allBoards[0].cmpTitles}
							cmpsOrder = {allBoards[0].cmpsOrder}
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
