import { useState } from 'react'
import { InputBase, Paper, Box } from '@mui/material'
import { BlockPicker } from 'react-color'
import * as Popover from '@radix-ui/react-popover'
import { boardService } from '../../services/board'

export function GroupTitleEditor({ group, updateBoard, onSave }) {
	const [groupTempTitle, setGroupTempTitle] = useState(group.title)
	const [isPopoverOpen, setIsPopoverOpen] = useState(false)

	const handleGroupTitleSave = () => {
		if (groupTempTitle.trim() && groupTempTitle !== group.title) {
			updateBoard(
				group.id,
				null,
				{ key: 'title', value: groupTempTitle },
				{ action: 'groupNameChanged' }
			)
		}
		onSave()
	}

	return (
		<Paper component='form' className='gh-title-input-container flex align-center input'>
			<Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
				<Popover.Trigger asChild>
					<Box className='color-picker-btn' onMouseDown={(e) => e.preventDefault()} />
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Content
						side='bottom'
						align='start'
						sideOffset={5}
						className='popover-content'
						style={{
							
							borderRadius: '8px',
							backgroundColor: '#fff',
							boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
							zIndex: 11,
						}}>
						<Box className='color-picker-content' sx={{ p: 1, borderRadius: 2 }}>
							<BlockPicker
								colors={Array.from(boardService.groupColors.values())}
								styles={{
									default: {
										card: {
											boxShadow: 'none',
											padding: '0',
										},
										head: { display: 'none' },
										triangle: { display: 'none' },
										label: { display: 'none' },
										input: { display: 'none' },
									},
								}}
								onChangeComplete={(color) => {
									updateBoard(
										group.id,
										null,
										{
											key: 'style',
											value: { color: color.hex },
										},
										{ action: 'groupColorChanged' }
									)
									setIsPopoverOpen(false)
									handleGroupTitleSave()
								}}
							/>
						</Box>
					</Popover.Content>
				</Popover.Portal>
			</Popover.Root>
			<InputBase
				autoFocus
				type='text'
				className='title-input'
				value={groupTempTitle}
				onChange={(e) => setGroupTempTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleGroupTitleSave()
					if (e.key === 'Escape') setIsEditingGroupTitle(false)
				}}
				onBlur={() => {
					if (!isPopoverOpen) handleGroupTitleSave()
				}}
				sx={{
					minWidth: `${groupTempTitle.length + 2.5}ch`,
					maxWidth: '500px',
					color: group.style.color,
				}}
				slotProps={{
					input: {
						sx: {
							fontFamily: 'inherit',
							fontSize: 'auto',
							color: group.style.color,
							fontWeight: 500,
							padding: 0,
						},
					},
				}}
			/>
		</Paper>
	)
}

export default GroupTitleEditor