import React, { useState } from 'react'
import Select from 'react-select'

export function MemberPicker({ info, onUpdate, board }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const selectedMembers = info?.map((memberId) => {
		const member = board?.members?.find((member) => member._id === memberId)
		return member ? { value: member._id, label: member.fullname } : null
	})

	const handleChange = (selected) => {
		const selectedIds = selected.map((option) => option.value)
		onUpdate(selectedIds)
	}

	const renderAvatars = () =>
		info?.map((memberId, idx) => {
			const member = board?.members?.find((m) => m._id === memberId)
			if (!member) return null

			return (
				<img
					key={member._id}
					className='member-avatar'
					src={member.imgUrl}
					alt={member.fullname}
					title={member.fullname} // Tooltip on hover
					style={{
						zIndex: info.length - idx,
						transform: `translateX(${idx * -12}px)`,
					}}
				/>
			)
		})

	const memberOptions =
		board?.members?.map((member) => ({
			value: member._id,
			label: (
				<div className='member-option'>
					<img className='member-option-img' src={member.imgUrl} alt={member.fullname} />
					{member.fullname}
				</div>
			),
		})) || []

	return (
		<div className='member-picker'>
			<div className='member-avatars' onClick={() => setIsDropdownOpen(true)}>
				{renderAvatars()}
			</div>

			{isDropdownOpen && (
				<div className='dropdown-container'>
					<Select
						options={memberOptions}
						isMulti
						closeMenuOnSelect={false}
						value={selectedMembers}
						onChange={handleChange}
						menuIsOpen={true}
						onMenuClose={() => setIsDropdownOpen(false)}
						components={{
							DropdownIndicator: null,
							IndicatorSeparator: null,
						}}
						styles={{
							control: (base) => ({ ...base, boxShadow: 'none' }),
							menu: (base) => ({ ...base, zIndex: 1001 }),
						}}
					/>
				</div>
			)}
		</div>
	)
}
