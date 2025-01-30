import { MemberPicker } from './cmps/MemberPicker'
import { StatusCmp } from './cmps/StatusCmp'
import { DatePicker } from './cmps/DatePicker'
import {PriorityPicker} from './cmps/PriorityPicker'
export function DynamicCmp({ board, cmp, info, onUpdate }) {
  //   console.log('DynamicCmp -> cmp:', cmp, 'info:', info)
  switch (cmp) {
    case 'status':
      return <StatusCmp board={board} info={info} onUpdate={onUpdate} />
    case 'memberIds':
      return <MemberPicker board={board} info={info} onUpdate={onUpdate} />
    case 'dueDate':
      return <DatePicker board={board} info={info} onUpdate={onUpdate} />
    case 'priority':
      return <PriorityPicker board={board} info={info} onUpdate={onUpdate} />
    default:
      return <span>UNKNOWN {cmp}</span>
  }
}
