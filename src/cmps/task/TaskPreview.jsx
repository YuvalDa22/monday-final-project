import { useSelector } from 'react-redux'
import { DynamicCmp } from './DynamicCmp'
import { boardService } from '../../services/board.service'
import { useEffect } from 'react'
import { updateBoard, logActivity } from '../../store/board/board.actions'

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
              logActivity(group, task, null, {
                action: 'labelChanged',
                message: `${cmp.charAt(0).toUpperCase() + cmp.slice(1)}`,
                free_txt: `Changed to ${data.title}`,
              })
              updateBoard(group.id, task.id, { key: cmp, value: data.id })
            }}
          />
        </td>
      ))}
    </>
  )
}
