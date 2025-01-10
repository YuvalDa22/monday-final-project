import { DatePicker } from './cmps/DatePicker'
import { MemberPicker } from './cmps/MemberPicker'
import { PriorityPicker } from './cmps/PriorityPicker'
import { StatusCmp } from './cmps/StatusCmp'

export function DynamicCmp({ cmp, info, onUpdate }) {
	switch (cmp) {
		case 'status-picker':
			return <StatusCmp info={info} onUpdate={onUpdate} />
		case 'member-picker':
			return <MemberPicker info={info} onUpdate={onUpdate} />
		case 'date-picker':
			return <DatePicker info={info} onUpdate={onUpdate} />
		case 'priority-picker':
			return <PriorityPicker info={info} onUpdate={onUpdate} />
		default:
			return <p>UNKNOWN {cmp}</p>
	}
}
