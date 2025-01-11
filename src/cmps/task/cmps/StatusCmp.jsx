import React, { useState } from 'react'

export function StatusCmp({ onUpdate, board, info }) {
	const [modal, setModal] = useState(false)
	const [currentStatus, setCurrentStatus] = useState(info)

	const currentLabel = board?.labels?.find((label) => label.id === info)
	// console.log('StatusCmp -> currentLabel', currentLabel);

	const style = { backgroundColor: currentLabel?.color, width: '100%', height: '100%' }
    const statusLabels = board?.labels?.filter(label => label.id[1] === '1')
    // function in charge of updating the status
	function handleLabelClick(label) {
		setCurrentStatus(label.id) // Set the current color
		setModal(false) 
	}

	const handleOutsideClick = () => {
		setModal(false) 
	}

	return (
		<div style={style} onClick={() => setModal(true)}>
			{currentLabel?.title || 'Set Status'}

			{modal && (
				<div className='modal-backdrop' onClick={handleOutsideClick} style={{ zIndex: 1000 }}>
					<div className='modal' onClick={(e) => e.stopPropagation()} style={{ zIndex: 1001 }}>
						<h3>Choose a Status</h3>
						<div className='label-list'>
							{statusLabels &&
								statusLabels.map((label) => (
									<div
										className='label-box'
										onClick={() => handleLabelClick(label)}
										style={{ backgroundColor: label.color }}>
										{label.title}
									</div>
								))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
