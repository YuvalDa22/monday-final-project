import { useSelector } from 'react-redux'
import { DynamicCmp } from './DynamicCmp'
import { boardService } from '../../services/board.service'
import { useEffect } from 'react'

export function TaskPreview({ task, cmpsOrder, board }) {
	// console.log('TaskPreview -> task:', task);
	return (
		<>
			{cmpsOrder.map((cmp, idx) => (

					<td key={idx} className='data-cell'>
					<DynamicCmp
						cmp={cmp}
						board={board}
						value={task[cmp]} // Pass the current value for this key
						info={boardService.getCmpInfo(cmp)}
						onUpdate={(data) => {
							console.log('Updating: ', cmp, 'with data:', data)
							// make a copy, update the task
							// Call action: updateTask(task)
							//updateTask(cmpType, $event)
						}}
						/>
				</td>
			))}
		</>
	)
}
