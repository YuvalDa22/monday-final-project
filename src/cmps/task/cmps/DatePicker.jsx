import React, { useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { utilService } from '../../../services/util.service';

export function DatePicker({ info, onUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(info ? new Date(info) : null); 

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            onUpdate(date.toISOString().split('T')[0]); // Pass the raw date in `yyyy-mm-dd` format
        } else {
            onUpdate(null); 
        }
        setIsOpen(false);
    };

    return (
        <div className="date-picker-container" onClick={() => setIsOpen(true)}>
            <span className="date-picker-display">{utilService.formatDate(selectedDate)}</span>
            {isOpen && (
                <div className="date-picker-dropdown">
                    <ReactDatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        inline 
                        onClickOutside={() => setIsOpen(false)}
                        calendarClassName="custom-calendar"
                    />
                </div>
            )}
        </div>
    );
}