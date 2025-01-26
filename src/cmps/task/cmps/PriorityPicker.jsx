// keeping the cmp in case we'll need to go back to our older functionality


import React from 'react';
import Select from 'react-select';

export function PriorityPicker({ onUpdate, board, info }) {
    const currentLabel = board?.labels?.find((label) => label.id === info);
    const style = {
      backgroundColor: currentLabel?.color || '#fff', // Current label color or default
      width: '100%',
      height: '100%',
      color: 'white',
    };
  
    // Filter labels based on type (e.g., "l1" for Status, "l2" for Priority)
    const labels = board?.labels?.filter((label) => label.id[1] === '2');
  
    // Handle label selection
    const handleChange = (selectedOption) => {
      onUpdate(selectedOption.id); // Pass the selected label ID to the parent
    };
  
    // Custom styles for React-Select
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
    };
  
    return (
      <Select
        options={labels} // Pass filtered labels as options
        getOptionLabel={(label) => <div className="label-box">{label.title}</div>}
        getOptionValue={(label) => label.id}
        value={labels.find((label) => label.id === info)}
        onChange={handleChange}
        styles={customStyles}
        isSearchable={true}
        components={{
          DropdownIndicator: () => null, // Remove the dropdown arrow
          IndicatorSeparator: () => null, // Remove the separator line
        }}
      />
    );
  }