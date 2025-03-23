import React from 'react'
import { Tooltip } from 'radix-ui'
import { Typography } from '@mui/material'

export function ProgressBar({ counts, index, label, board, isCollapsed }) {
	const totalAmountOfTasksWithStatus = Object.values(counts[label] || {}).reduce(
		(sum, value) => sum + value,
		0
	)
	const collapsed = isCollapsed ? 'collapsed' : ''
	const first = index === 0 ? 'first' : ''

	if (!totalAmountOfTasksWithStatus) return null

	return (
		<td className={`groupPreview_ProgressBar_container ${first} ${collapsed}`}>
			<div className={`ProgressBar_colors_container ${collapsed}`}>
				{isCollapsed && (
					<Typography variant='body2' className='collapsed-progress-bar-text'>
						{counts[label] && label}
					</Typography>
				)}
				<div className='ProgressBar_multiple_colors'>
					{Object.entries(counts[label] || {}).map(([key, value]) => (
						<Tooltip.Provider key={key}>
							<Tooltip.Root delayDuration={300} skipDelayDuration={0}>
								<Tooltip.Trigger asChild>
									<div
										className='ProgressBar_single_color'
										style={{
											backgroundColor: board?.labels?.find((label) => label.id === key)?.color,
											width: `${(value / totalAmountOfTasksWithStatus) * 100}%`,
										}}></div>
								</Tooltip.Trigger>
								<Tooltip.Portal>
									<Tooltip.Content className='TooltipContent' sideOffset={8}>
										{`${
											board?.labels?.find((label) => label.id === key)?.title
										} ${value}/${totalAmountOfTasksWithStatus} \u00A0 ${
											((value / totalAmountOfTasksWithStatus) * 100) % 1 === 0
												? (value / totalAmountOfTasksWithStatus) * 100 // if division is clean simply show the number but if not show 1 digit after the dot
												: ((value / totalAmountOfTasksWithStatus) * 100).toFixed(1)
										}%`}
										<Tooltip.Arrow className='TooltipArrow' />
									</Tooltip.Content>
								</Tooltip.Portal>
							</Tooltip.Root>
						</Tooltip.Provider>
					))}
				</div>
			</div>
		</td>
	)
}
