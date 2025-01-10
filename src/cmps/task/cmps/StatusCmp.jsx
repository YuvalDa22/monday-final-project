export function StatusCmp({ info, onUpdate }) {
	console.log('status', info)
	return <span onClick={() => onUpdate('status update')}>Status</span>
}
