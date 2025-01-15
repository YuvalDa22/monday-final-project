import React from 'react'
import { updateBoard } from '../../store/board/board.actions';
import * as XLSX from "xlsx";


export function Footer({ board, checkedTasks =[] }) {

	function getGroupByTask(task) {
		return board.groups.find((group) => 
			group.tasks.some(t => t.id === task.id)
		);
	};

	function handleDuplicate() {

		checkedTasks.forEach(checkedTask => {
			const groupId =  getGroupByTask(checkedTask).id
			updateBoard(board, groupId, null, {key: tasks, value: [[...board.groups[groupId].tasks], {...checkedTask}]})
		});
	}

	function handleExport(checkedTasks) {

			if (!checkedTasks || checkedTasks.length === 0) {
			  console.warn("No tasks selected for export.");
			  return;
			}
		  
			// Define headers based on your task structure
			const headers = [...board.cmpTitles];
			
			// Extract data for Excel rows
			const data = checkedTasks.map((task) => 
				headers.map(header => task[header])
			);

			// Add headers to the top of the data array
			const excelData = [headers, ...data];
		  
			// Create the worksheet
			const worksheet = XLSX.utils.aoa_to_sheet(excelData);
		  
			// Apply custom styles (e.g., background colors)
			// Note: XLSX does not natively support styling, but we can add styles via cell comments or 3rd-party libraries if required
			checkedTasks.forEach((task, index) => {
			  const rowIndex = index + 2; // +2 because the header row is at index 1
			  const bgColor = task.color || "#FFFFFF"; // Example background color
		  
			  // Apply background color (cell comments as placeholders for styles)
			  worksheet[`A${rowIndex}`].s = { fill: { fgColor: { rgb: bgColor.replace("#", "") } } };
			});
		  
			// Create the workbook and append the worksheet
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, "Checked Tasks");
		  
			// Export the Excel file
			XLSX.writeFile(workbook, "checked_tasks.xlsx");
		  
	}

	function handleArchive() {
		console.log('Archive')
	}

	function handleDelete() {
		checkedTasks.forEach(checkedTask => {
			const groupId =  getGroupByTask(checkedTask).id
			const filteredTasks = board.groups.tasks.filter(task => task.id !== checkedTask.id)
			updateBoard(board, groupId, null, {key: tasks, value: [...filteredTasks]})
		});
	}

	function handleConvert() {
		console.log('Convert')
	}

	function handleMoveTo(newLocationObject) {
		checkedTasks.forEach(checkedTask => {
			const groupId =  getGroupByTask(checkedTask).id
			const filteredTasks = board.groups.tasks.filter(task => task.id !== checkedTask.id)
			updateBoard(
				newLocationObject.board,
				newLocationObject.groupId,
				null,
				{key: tasks, value: [[...newLocationObject.board.groups[newLocationObject.groupId].tasks], {...checkedTask}]}
			)
			updateBoard(board, groupId, null, {key: tasks, value: [...filteredTasks]})
		});
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
