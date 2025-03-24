import React, { useState, useEffect, useRef } from 'react'
import { DatePicker as VibeDatePicker, DialogContentContainer } from '@vibe/core'
import { Add, AddSmall } from '@vibe/icons'
import { Icon, IconButton } from '@vibe/core'
import { getSvg, utilService } from '../../../services/util.service'
import moment from 'moment'

const SvgIcon = ({ iconName, options, className }) => {
  return (
    <i
      dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
      className={`svg-icon ${className || ''}`}
    ></i>
  )
}

export function DatePicker({ info, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(info ? moment(info) : null)
  const datePickerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false) // Close the date picker
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateChange = (date) => {
    if (!date || !date.isValid()) {
      console.warn('Received an invalid or null date.')
      setSelectedDate(null)
      onUpdate(null)
      return
    }

    setSelectedDate(date)
    const jsDate = date.toDate() // Convert Moment.js to JavaScript Date
    console.log('jsDate', jsDate)

    const formattedDate = utilService.formatDate(jsDate)
    console.log('formattedDate', formattedDate)

    onUpdate({ id: formattedDate, title: formattedDate })
    setIsOpen(false)
  }

  //TODO : Make + icon of 'date-picker-add-icon' bigger
  const initialVisibleMonth = selectedDate || moment()

  return (
    <div className='date-picker-container' ref={datePickerRef}>
      <div className='input-wrapper' onClick={() => setIsOpen(!isOpen)}>
        {selectedDate ? (
          <span className='date-picker-display'>
            {utilService.formatDate(selectedDate.toDate())}
          </span>
        ) : (
          <div>
            <IconButton
              size='xxs'
              className='date-picker-add-icon'
              kind='primary'
              ariaLabel='Add Due Date'
              onClick={() => setIsOpen(!isOpen)}
            >
              <AddSmall />
            </IconButton>
            <SvgIcon
              iconName='calendar'
              options={{ height: 20, width: 20, color: 'grey' }}
              className='calendar-icon'
            />
          </div>
        )}
      </div>

      {isOpen && (
        <DialogContentContainer
          className='date-picker-dropdown'
          type={DialogContentContainer.types.POPOVER}
        >
          <VibeDatePicker
            className='custom-vibe-datepicker'
            date={selectedDate}
            onPickDate={handleDateChange}
            inline
            onClose={() => setIsOpen(false)}
            shouldBlockYear={false}
          />
        </DialogContentContainer>
      )}
    </div>
  )
}
