import React from 'react'
import Select from 'react-select'

export function StatusCmp({ onUpdate, board, info }) {
  const currentLabel = board?.labels?.find((label) => label.id === info)
  const style = {
    backgroundColor: currentLabel?.color,
    width: '100%',
    height: '100%',
    color: 'white',
  }

  const labels = board?.labels?.filter((label) => label.id[1] === '1')

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
