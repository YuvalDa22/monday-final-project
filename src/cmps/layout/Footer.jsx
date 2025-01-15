import React from 'react'

export function Footer({ checkedTasks = [] }) {
	function handleDuplicate() {
		console.log('Duplicate')
	}

	function handleExport() {
		console.log('Export')
	}

	function handleArchive() {
		console.log('Archive')
	}

	function handleDelete() {
		console.log('Delete')
	}

	function handleConvert() {
		console.log('Convert')
	}

	function handleMoveTo() {
		console.log('Move to')
	}

	function handleApps() {
		console.log('Apps')
	}

	return (
		<footer className='footer'>
			<div className='footer-content'>
				<div className='footer-number'>
					<h1>{checkedTasks?.length}</h1>
				</div>
				<div className='footer-items-selected'>
					<h1>Items Selected</h1>
					<div className='footer-balls'>
						{checkedTasks.map((_, idx) => (
							<div key={idx} className='ball'></div>
						))}
					</div>
				</div>
				<div className='footer-actions'>
					<div onClick={handleDuplicate} className='footer-action'>
						<span>...</span>
						<span>Duplicate</span>
					</div>
					<div onClick={handleExport} className='footer-action'>
						<span>...</span>
						<span>Export</span>
					</div>
					<div onClick={handleArchive} className='footer-action'>
						<span>...</span>
						<span>Archive</span>
					</div>
					<div onClick={handleDelete} className='footer-action'>
						<span>...</span>
						<span>Delete</span>
					</div>
					<div onClick={handleConvert} className='footer-action' disabled>
						<span>...</span>
						<span>Convert</span>
					</div>
					<div onClick={handleMoveTo} className='footer-action'>
						<span>...</span>
						<span>Move to</span>
					</div>
					<div onClick={handleApps} className='footer-action'>
						<span>...</span>
						<span>Apps</span>
					</div>
				</div>
				<div className='footer-close'>
					<div>X</div>
				</div>
			</div>
		</footer>
	)
}
