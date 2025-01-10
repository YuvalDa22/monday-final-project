export function MemberPicker({ info, onUpdate }) {
	console.log('members', info)
	return <span onClick={() => onUpdate('member update')}>Member</span>
}
