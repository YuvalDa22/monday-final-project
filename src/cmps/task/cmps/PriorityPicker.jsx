import React, { useState } from 'react';

export function PriorityPicker({ onUpdate, board, info }) {
    const [modal, setModal] = useState(false);

    const currentLabel = board?.labels?.find((label) => label.id === info);
    const style = { backgroundColor: currentLabel?.color || '#ccc', width: '100%', height: '100%' };
    const priorityLabels = board?.labels?.filter((label) => label.id[1] === '2'); // Priority labels start with `l2`

    const handleLabelClick = (label) => {
        onUpdate(label.id); 
        setModal(false); 
    };

    const handleOutsideClick = () => {
        setModal(false); 
    };

    return (
        <div style={style} onClick={() => setModal(true)}>
            {currentLabel?.title || 'Set Priority'}

            {modal && (
                <div className="modal-backdrop" onClick={handleOutsideClick} style={{ zIndex: 1000 }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ zIndex: 1001 }}>
                        <h3>Choose a Priority</h3>
                        <div className="label-list">
                            {priorityLabels.map((label) => (
                                <div
                                    key={label.id}
                                    className="label-box"
                                    onClick={() => handleLabelClick(label)}
                                    style={{
                                        backgroundColor: label.color
                                    }}
                                >
                                    {label.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}