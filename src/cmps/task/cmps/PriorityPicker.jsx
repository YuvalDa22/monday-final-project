import React from 'react';
import Select from 'react-select';

export function PriorityPicker({ onUpdate, board, info }) {
    const currentLabel = board?.labels?.find((label) => label.id === info); // Find the current priority label
    const style = {
        backgroundColor: currentLabel?.color || '#fff', // Use the color of the current label or a default gray
        width: '100%',
        height: '100%',
    };

    // Filter priority labels (IDs start with "l2")
    const priorityLabels = board?.labels?.filter((label) => label.id[1] === '2');

    // Handle change in the dropdown
    const handleChange = (selectedOption) => {
        onUpdate(selectedOption.id); // Pass the selected label ID to the parent
    };

    // Custom styles for the React-Select component
    const customStyles = {
        control: (provided) => ({
            ...provided,
            ...style, // Apply custom style
            border: 'none',
            boxShadow: 'none',
        }),
        option: (provided, { data, isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: data.color, // Use the color of the label
            color: isSelected || isFocused ? '#fff' : '#333', // Adjust text color for contrast
            cursor: 'pointer',
        }),
        singleValue: (provided) => ({
            ...provided,
            color: currentLabel?.color || '#333', // Single value text color
            fontWeight: 'bold',
        }),
    };

    return (
        <div style={style}>
            <Select
                options={priorityLabels} // Pass the priority labels as options
                getOptionLabel={(label) => (
                    <div>
                        {label.title} {/* Display label title */}
                    </div>
                )}
                getOptionValue={(label) => label.id} // Use `id` as the value key
                value={priorityLabels.find((label) => label.id === info)} // Match the current priority label
                onChange={handleChange}
                styles={customStyles}
                isSearchable={true} // Allow searching in the dropdown
                components={{
                    DropdownIndicator: () => null, // Remove the dropdown arrow
                    IndicatorSeparator: () => null, // Remove the separator line
                }}
            />
        </div>
    );
}