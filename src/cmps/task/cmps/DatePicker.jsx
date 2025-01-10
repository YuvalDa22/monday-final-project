export function DatePicker({ info, onUpdate }) {
	console.log('date', info)
	return <span onClick={() => onUpdate('date update')}>Date</span>
}
