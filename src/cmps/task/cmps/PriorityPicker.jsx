export function PriorityPicker({ info, onUpdate, value, board }) {
	const currentLabel = board?.labels?.find(label => label.id === value);

	const handleStatusChange = () => {
		const newStatus = 'completed'; // Example change logic
		onUpdate(newStatus); // Notify parent
	  };

	  

	return <span style={{backgroundColor: currentLabel?.color}} onClick={handleStatusChange}>{currentLabel?.title || 'Set Status'}</span>;
}
