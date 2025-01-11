export function MemberPicker({ info, onUpdate, board }) {
	return <span onClick={() => onUpdate('member update')}>{info?.fullname || 'Set Members'}</span>
}
