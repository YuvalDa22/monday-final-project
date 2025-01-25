import React, { useState } from 'react'
import { utilService } from '../../../services/util.service'
import { DateField, DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs'

export function DatePickerCmp({ info, onUpdate }) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState(info ? new Date(info) : null)

	const handleDateChange = (date) => {
		setSelectedDate(date)
		if (date) {
			const formattedDate = utilService.formatDate(date)
			onUpdate(formattedDate) // Pass the formatted date
		} else {
			onUpdate(null)
		}
		setIsOpen(false)
	}

	return (
		<div className='date-picker-container' onClick={() => setIsOpen(true)}>
			{info ? (
				<>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer components={['DateField']}>
                            <DatePicker  defaultValue={dayjs(info)} format='LL' />
						</DemoContainer>
					</LocalizationProvider>
				</>
			) : (
				<></>
			)}
		</div>
	)
}
