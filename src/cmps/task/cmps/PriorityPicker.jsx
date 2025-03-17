import React from 'react'
import Select from 'react-select'

export function PriorityPicker({ onUpdate, board, info }) {
  const currentLabel = board?.labels?.find((label) => label.id === info) // Find the current priority label
  const style = {
    backgroundColor: currentLabel?.color, // Use the color of the current label
    width: '100%',
    height: '100%',
    color: 'white',
    borderRadius: '0px',
    
  }

  // Filter priority labels (IDs start with "l2")
  const labels = board?.labels?.filter((label) => label.id[1] === '2' && label.title != '')

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
      
    }),
    option: (provided, { data, isFocused, isSelected }) => ({
      ...provided,
      backgroundColor: data.color,
      color: isSelected || isFocused ? '#fff' : '#333',
      cursor: 'pointer',
      margin: '6px auto',
      padding: '8px 12px',
      width: '152px',
      height: '32px auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '2px',
      marginBottoms: '6px',
    }),
    menu: (provided) => ({
      ...provided,
      width: '200px',
      top: '90%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '6px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow:' 0 0 8px rgba(0, 0, 0, 0.5)',
    }),
  };

  return (
    <Select
      options={labels}
      getOptionLabel={(label) => <div className='label-box'>{label.title}</div>}
      getOptionValue={(label) => label.id}
      value={labels.find((label) => label.id === info)}
      onChange={handleChange}
      styles={customStyles}
      placeholder=''
      isSearchable={true}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
    />
  )
}