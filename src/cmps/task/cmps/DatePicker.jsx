import React, { useState, useEffect, useRef } from 'react';
import { DatePicker as VibeDatePicker } from '@vibe/core';
import { Add, AddSmall } from '@vibe/icons';
import { Icon, IconButton } from '@vibe/core';
import { getSvg, utilService } from '../../../services/util.service';

const SvgIcon = ({ iconName, options, className }) => {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      className={`svg-icon ${className || ''}`}
    ></i>
  );
};

export function DatePicker({ info, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    info ? new Date(info) : null
  );
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false); // Close the date picker
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDateChange = (date) => {
    if (!date || !date.isValid()) {
      console.warn('Received an invalid or null date.');
      setSelectedDate(null);
      onUpdate(null);
      return;
    }

    const jsDate = date.toDate(); // Convert Moment.js to JavaScript Date

    setSelectedDate(jsDate);
    const formattedDate = utilService.formatDate(jsDate);
    onUpdate({ id: formattedDate, title: formattedDate });
    setIsOpen(false);
  };

  //TODO : Make + icon of 'date-picker-add-icon' bigger

  return (
    <div className="date-picker-container" ref={datePickerRef}>
      <div className="input-wrapper" onClick={() => setIsOpen(!isOpen)}>
        {selectedDate ? (
          <span className="date-picker-display">
            {utilService.formatDate(selectedDate)}
          </span>
        ) : (
          <div>
              <IconButton
          size="xxs"
          className="date-picker-add-icon"
          kind="primary"
          ariaLabel="Add Due Date"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AddSmall />
        </IconButton>
          <SvgIcon
            iconName="calendar"
            options={{ height: 20, width: 20, color: 'grey'}}
            className="calendar-icon"
          />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="date-picker-dropdown">
          <VibeDatePicker
            value={selectedDate}
            onPickDate={handleDateChange}
            inline
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
