export function StatusCmp({ value, onUpdate, board, info }) {
    const currentLabel = board?.labels?.find(label => label.id === value);
    // console.log('StatusCmp -> currentLabel', currentLabel);
    
    const handleStatusChange = () => {
      const newStatus = 'completed'; // Example change logic
      onUpdate(newStatus); // Notify parent
    };
  
    return <span style={{backgroundColor: currentLabel?.color}} onClick={handleStatusChange}>{currentLabel?.title || 'Set Status'}</span>;
  }