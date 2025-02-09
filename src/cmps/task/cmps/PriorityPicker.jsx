import React from 'react'
import Select from 'react-select'

export function PriorityPicker({ onUpdate, board, info }) {
  const currentLabel = board?.labels?.find((label) => label.id === info) // Find the current priority label
  const style = {
    backgroundColor: currentLabel?.color, // Use the color of the current label
    width: '100%',
    height: '100%',
    color: 'white',
  }

  // Filter priority labels (IDs start with "l2")
  const labels = board?.labels?.filter((label) => label.id[1] === '2')

  // Handle change in the dropdown
  const handleChange = (selectedOption) => {
    onUpdate(selectedOption)
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      ...style,
      border: 'none',
      boxShadow: 'none',
      borderRadius: '0px',
    }),
    option: (provided, { data, isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: data.color,
      color: isSelected || isFocused ? '#fff' : '#333',
      cursor: 'pointer',
    }),
  }

  return (
    <Select
      options={labels}
      getOptionLabel={(label) => <div className='label-box'>{label.title}</div>}
      getOptionValue={(label) => label.id}
      value={labels.find((label) => label.id === info)}
      onChange={handleChange}
      styles={customStyles}
      isSearchable={true}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
    />
  )
}
