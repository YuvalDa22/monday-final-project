export function MemberPicker({ info, onUpdate, value, board }) {
	return <span onClick={() => onUpdate('member update')}>{value?.fullname || 'Set Members'}</span>
}
