import { Padding } from '@mui/icons-material'
import React from 'react'
import Select from 'react-select'

export function StatusCmp({ onUpdate, board, info }) {
	const currentLabel = board?.labels?.find((label) => label.id === info)
	const style = {
		backgroundColor: currentLabel?.color,
	}
	const statusLabels = board?.labels?.filter((label) => label.id[1] === '1')

	const handleChange = (selectedOption) => {
		onUpdate(selectedOption.id)
	}

	const customStyles = {
		control: (provided) => ({
			...provided,
			...style,
			border: 'none',
			boxShadow: 'none', 
           
		}),
		option: (provided, { data, isFocused, isSelected }) => ({
			...provided,
			backgroundColor: data.color,
			color: isSelected || isFocused ? '#fff' : '#333',
			cursor: 'pointer',
		}),
		singleValue: (provided) => ({
			...provided,
			// add styles for individual labels in list
		}),
	}

	return (
		<>
			<Select
				options={statusLabels} 
				getOptionLabel={(label) => (
					<div style={{color: 'white'}}>
						{label.title}
					</div>
				)}
				getOptionValue={(label) => label.id}
				value={statusLabels.find((label) => label.id === info)}
				onChange={handleChange}
				styles={customStyles}
				components={{
					DropdownIndicator: () => null,
					IndicatorSeparator: () => null,
				}}
			/>
		</>
	)
}
