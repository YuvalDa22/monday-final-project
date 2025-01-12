import React, { useState } from 'react';
import Select from 'react-select';

export function MemberPicker({ info, onUpdate, board }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Toggle dropdown state

    // Map board members to options for the dropdown
    const memberOptions = board?.members?.map((member) => ({
        value: member._id,
        label: (
            <div className="member-option">
                <img
                    className="member-option-img"
                    src={member.imgUrl}
                    alt={member.fullname}
                />
                {member.fullname}
            </div>
        ),
    })) || [];

    // Highlight members in `info` (pre-selected values)
    const selectedMembers = info?.map((memberId) => {
        const member = board?.members?.find((m) => m._id === memberId);
        return member ? { value: member._id, label: member.fullname } : null;
    }).filter(Boolean);

    // Handle selection changes
    const handleChange = (selected) => {
        const selectedIds = selected.map((option) => option.value); // Get selected member IDs
        onUpdate(selectedIds); // Call the update function with the new member IDs
    };

    return (
        <div className="member-picker">
            {/* Member avatars */}
            <div
                className="member-avatars"
                onClick={() => setIsDropdownOpen(true)} // Open dropdown when clicking the component
            >
                {info?.map((memberId, idx) => {
                    const member = board?.members?.find((m) => m._id === memberId);
                    if (!member) return null;
                    return (
                        <img
                            key={member._id}
                            className="member-avatar"
                            src={member.imgUrl}
                            alt={member.fullname}
                            title={member.fullname} // Tooltip on hover
                            style={{ zIndex: info.length - idx, transform: `translateX(${idx * -12}px)` }} // Keep dynamic styles
                        />
                    );
                })}
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
                <div className="dropdown-container">
                    <Select
                        options={memberOptions}
                        isMulti
                        closeMenuOnSelect={false}
                        value={selectedMembers}
                        onChange={handleChange}
                        menuIsOpen={true} // Keep the dropdown open
                        onMenuClose={() => setIsDropdownOpen(false)} // Close when the dropdown loses focus
                        components={{
                            DropdownIndicator: null, // Remove default dropdown arrow
                            IndicatorSeparator: null, // Remove separator line
                        }}
                        styles={{
                            control: (base) => ({ ...base, boxShadow: 'none' }),
                            menu: (base) => ({ ...base, zIndex: 1001 }),
                        }}
                    />
                </div>
            )}
        </div>
    );
}