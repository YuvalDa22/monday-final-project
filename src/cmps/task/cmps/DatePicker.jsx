export function DatePicker({ info, onUpdate }) {
	return <span onClick={() => onUpdate('date update')}>{info.selectedDate}</span>
}
