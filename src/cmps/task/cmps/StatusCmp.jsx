import { Padding } from '@mui/icons-material'
import React from 'react'
import Select from 'react-select'

export function StatusCmp({ onUpdate, board, info }) {
	const currentLabel = board?.labels?.find((label) => label.id === info)
	const style = {
		backgroundColor: currentLabel?.color || '#ccc',
		width: '100%',
		height: '100%',
	}
	const statusLabels = board?.labels?.filter((label) => label.id[1] === '1') // Filter for status labels starting with `l1`

	const handleChange = (selectedOption) => {
		onUpdate(selectedOption.id) // Pass selected label ID to onUpdate
	}

	const customStyles = {
		control: (provided) => ({
			...provided,
			...style, // Apply your custom style
			border: 'none',
			boxShadow: 'none',            
		}),
		option: (provided, { data, isFocused, isSelected }) => ({
			...provided,
			backgroundColor: data.color,
			color: isSelected || isFocused ? '#fff' : '#333', // Adjust text color for contrast
			cursor: 'pointer',
            // margin: '1rem'
		}),
		singleValue: (provided) => ({
			...provided,
			color: currentLabel?.color || '#333', // Single value text color
			fontWeight: 'bold',
		}),
	}

	return (
		<div style={style}>
			<Select
				options={statusLabels} 
				getOptionLabel={(label) => (
					<div>
						{label.title}
					</div>
				)}
				getOptionValue={(label) => label.id} // Use `id` as the value key
				value={statusLabels.find((label) => label.id === info)} // Find the current label
				onChange={handleChange}
				styles={customStyles}
				isSearchable={true}
                components={{
                    DropdownIndicator: () => null, // Removes the arrow icon
                    IndicatorSeparator: () => null, // Removes the separator line
                }}
			/>
		</div>
	)
}
