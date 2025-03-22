import React from 'react'
import { Link } from 'react-router-dom'
import { IconButton, Menu, MenuItem, Checkbox, Input } from '@mui/material'
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined'
import { DynamicCmp } from '../task/DynamicCmp'
import { getSvg } from '../../services/util.service'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { updateBoard } from '../../store/board/board.actions'
import { Icon } from '@vibe/core'
import { Delete, Duplicate } from '@vibe/icons'

const SvgIcon = ({ iconName, options, className }) => {
	return (
		<i className={className} dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}></i>
	)
}

export function Item({ item, board, group, cmpsOrder }) {
	// This is what is shown when a row is being dragged

	return (
		<tr key={`DRAGGEDtask-${item.id}`} className='draggedTask'>
			<td>
				<Checkbox size='small' />
			</td>
			<td>
				<Link
					to='#' // no where
					className='task-cell-container'
					style={{ width: '1000px', height: '38px' }}>
					<span>{item.title}</span>
					<div style={{ display: 'flex', flexDirection: 'row', marginRight: 10 }}>
						<SvgIcon iconName={'task_open_icon'} className={'svgOpenIcon'} />
						<div>Open</div>
					</div>
				</Link>
			</td>
			{cmpsOrder.map((cmp, idx) => {
				return (
					<td
						key={idx}
						className='data-cell'
						style={{
							width: '159px',
							height: '38px',
							alignContent: 'center',
							textAlign: 'center',
						}}>
						<DynamicCmp
							cmp={cmp}
							board={board}
							info={item[cmp]} // Pass the current value for this key
							onUpdate={(data) => {}}
						/>
					</td>
				)
			})}
		</tr>
	)
}

export default function GroupItemContainer({
	item,
	group,
	board,
	cmpsOrder,
	editingTaskId,
	setExistingItemTempTitle,
	existingItemTempTitle,
	handleEdit,
	handleSave,
	handleCancel,
	checkedTasksList,
	handleTaskChecked,
	anchorEl,
	selectedTask,
	handleMenuClick,
	handleMenuClose,
	handleTaskDeleted,
	handleTaskDuplicate,
}) {
	const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } =
		useSortable({
			id: item.id, // ✅ Use task ID,
		})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<tr
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			key={`task-${item.id}`}
			className='task-row'
			style={{
				...style,
				backgroundColor:
					editingTaskId === item.id ||
					checkedTasksList.some(
						(checkedTask) => checkedTask.groupId === group.id && checkedTask.taskId === item.id
					)
						? 'rgb(208,228,252)'
						: '',
			}}>
			<td>
				<div className='task-menu'>
					<IconButton
						onClick={(event) => handleMenuClick(event, item)}
						sx={{
							borderRadius: 1,
							padding: '0px 5px',
							'&:hover': { backgroundColor: '#d8d4e4' },
						}}>
						<MoreHorizOutlinedIcon sx={{ width: '15px' }} />
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl) && selectedTask?.id === item.id}
						onClose={handleMenuClose}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						slotProps={{
							paper: {
								sx: {
									zIndex: 1300,
									borderRadius: '8px',
									color: '#333333',
									fontSize: '15px',
									fontWeight: '400',
									padding: 0,
									fontFamily: 'Figtree, Roboto, sans-serif',
									boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.1)',
									width: '240px',
								},
							},
							list: { sx: { padding: '8px' } },
						}}
						disableAutoFocusItem
						disableEnforceFocus
						disableRestoreFocus>
						<MenuItem
							onClick={() => handleTaskDeleted(board, group, item)}
							sx={{
								display: 'flex',
								gap: '10px',
								alignItems: 'center',
								cursor: 'pointer',
								'&:hover': { backgroundColor: '#f5f5f5' },
                padding: '4px 8px',
							}}>
							<Icon icon={Delete} iconSize={18} style={{ alignSelf: 'start' }} />
							<span style={{fontSize: '14px'}}>Remove task</span>
						</MenuItem>
						<MenuItem
							onClick={() => handleTaskDuplicate(board, group, item)}
							sx={{
								display: 'flex',
								gap: '10px',
								alignItems: 'center',
								cursor: 'pointer',
								'&:hover': { backgroundColor: '#f5f5f5' },
                padding: '4px 8px',
							}}>
							<Icon icon={Duplicate} iconSize={18} style={{ alignSelf: 'start' }} />
							<span style={{fontSize: '14px'}}>Duplicate task</span>
						</MenuItem>
					</Menu>
				</div>

				<Checkbox
					size='small'
					className={'checkbox-cell'}
					checked={checkedTasksList.some(
						(checkedTask) => checkedTask.groupId === group.id && checkedTask.taskId === item.id
					)}
					onChange={(event) => handleTaskChecked(event, item)}
				/>
			</td>
			<td>
				<Link
					to={`task/${item.id}`}
					className='task-cell-container'
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						position: 'relative', // Ensures internal elements align correctly
					}}>
					<div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
						{editingTaskId === item.id ? (
							<Input
								className='taskTitleInput'
								autoFocus
								disableUnderline
								type='text'
								value={existingItemTempTitle}
								onChange={(event) => setExistingItemTempTitle(event.target.value)}
								onKeyDown={(event) => {
									if (event.key === 'Enter') handleSave(item)
									if (event.key === 'Escape') handleCancel()
								}}
								onClick={(event) => event.preventDefault()}
								onBlur={() => handleSave(item)}
								sx={{
									fontFamily: 'inherit',
									height: '25px',
									width: 'min(380px, 100%)',
									backgroundColor: 'white',
									borderRadius: '3px',
									padding: '0px 5px',
									border: '1px solid #0073ea',
									flexGrow: 0,
								}}
							/>
						) : (
							<span
								onClick={(event) => {
									event.preventDefault()
									event.stopPropagation()
									handleEdit(item.id, item.title)
								}}
								style={{
									minWidth: 0, // Prevents overflow
									overflow: 'hidden',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
									maxWidth: '380px', // Prevents the icon from being pushed out
								}}>
								{item.title}
							</span>
						)}
					</div>

					{/* This ensures the icon stays at the right place */}
					<div
						className='openTaskDetails_container'
						style={{
							position: 'absolute',
							right: '5px', // Keep consistent with other icons
							display: 'flex',
							alignItems: 'center',
						}}>
						<SvgIcon iconName={'taskdetails_bubble'} className={'svgOpenIcon'} />
					</div>
				</Link>
			</td>

			{cmpsOrder.map((cmp, idx) => {
				return (
					<td key={idx} className='data-cell'>
						<DynamicCmp
							cmp={cmp}
							board={board}
							info={item[cmp]} // Pass the current value for this key
							onUpdate={(data) => {
								const free_txt = cmp === 'memberIds' ? '' : `To: ${data.title}`
								updateBoard(
									group.id,
									item.id,
									{ key: cmp, value: data.id },
									{
										action: 'labelChanged',
										message: `Changed ${cmp.charAt(0).toUpperCase() + cmp.slice(1)}`,
										free_txt,
									}
								)
							}}
						/>
					</td>
				)
			})}
			<td className='end-cell'></td>
		</tr>
	)
}
