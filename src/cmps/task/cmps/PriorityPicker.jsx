export function PriorityPicker({ info, onUpdate }) {
	console.log('priority', info)
	return <span onClick={() => onUpdate('priority update')}>Priority</span>
}
