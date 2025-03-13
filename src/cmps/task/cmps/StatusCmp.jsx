import React from 'react';
import Select from 'react-select';

export function StatusCmp({ onUpdate, board, info }) {
  const currentLabel = board?.labels?.find((label) => label.id === info);
  const style = {
    backgroundColor: currentLabel?.color,
    width: '100%',
    height: '100%',
    color: 'white',
    borderRadius: '0px',
  };

  const labels = board?.labels?.filter(
    (label) => label.id[1] === '1' && label.title
  );

  const handleChange = (selectedOption) => {
    onUpdate(selectedOption);
  };

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
      margin: '5px auto',
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
      getOptionLabel={(label) => <div className="label-box">{label.title}</div>}
      getOptionValue={(label) => label.id}
      value={labels.find((label) => label.id === info)}
      onChange={handleChange}
      styles={customStyles}
      placeholder=""
      isSearchable={true}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
    />
  );
}
