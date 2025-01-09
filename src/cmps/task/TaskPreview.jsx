import { useSelector } from 'react-redux'
import { DynamicCmp } from './DynamicCmp'
import { boardService } from '../../services/board.service'

export function TaskPreview({ task }) {
	const cmpsOrder = useSelector((storeState) => storeState.boardModule.cmpsOrder)
	return (
		<section>
			{cmpsOrder.map((cmp, idx) => {
				return (
					<td>
						<DynamicCmp
							cmp={cmp}
							key={idx}
                            info={(cmp) => {
                                boardService.getCmpInfo(cmp)
                            }}
							onUpdate={(data) => {
								console.log('Updating: ', cmp, 'with data:', data)
								// make a copy, update the task
								// Call action: updateTask(task)
								//updateTask(cmpType, $event)
							}}
						/>
					</td>
				)
			})}
		</section>
	)
}
