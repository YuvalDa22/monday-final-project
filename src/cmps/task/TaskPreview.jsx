import { useSelector } from 'react-redux'
import { DynamicCmp } from './DynamicCmp'
import { boardService } from '../../services/board.service'
import { useEffect } from 'react'
import { updateBoard } from '../../store/board/board.actions'

export function TaskPreview({ task, cmpsOrder, board, group }) {
  return (
    <>
      {cmpsOrder.map((cmp, idx) => (
        <td key={idx} className='data-cell'>
          <DynamicCmp
            cmp={cmp}
            board={board}
            info={task[cmp]} // Pass the current value for this key
            onUpdate={(data) => {
              console.log('Updating: ', cmp, 'with data:', data)
              updateBoard(board, group, task, { key: cmp, value: data })
            }}
          />
        </td>
      ))}
    </>
  )
}
