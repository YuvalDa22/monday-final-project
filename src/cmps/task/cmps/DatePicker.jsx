import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getSvg, utilService } from '../../../services/util.service'

const SvgIcon = ({ iconName, options, className }) => {
	return (
		<i
			dangerouslySetInnerHTML={{ __html: getSvg(iconName, options) }}
			className={`svg-icon ${className || ''}`}></i>
	)
}

export function DatePicker({ info, onUpdate }) {
	const [isOpen, setIsOpen] = useState(false)
	const [selectedDate, setSelectedDate] = useState(info ? new Date(info) : new Date())

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
		<div className='date-picker-container'>
			<div className='input-wrapper' onClick={() => setIsOpen(!isOpen)}>
				{info ? (
					<span className='date-picker-display'>{utilService.formatDate(selectedDate)}</span>
				) : (
					<SvgIcon iconName='calendar' options={{ height: 20, width: 20, color: 'grey' }} />
				)}
			</div>

			{isOpen && (
				<div className='date-picker-dropdown'>
					<ReactDatePicker
						selected={selectedDate}
						onChange={handleDateChange}
						inline
						onClickOutside={() => setIsOpen(false)}
						calendarClassName='modern-calendar'
						fixedHeight
						renderCustomHeader={({
							date,
							decreaseMonth,
							increaseMonth,
							prevMonthButtonDisabled,
							nextMonthButtonDisabled,
						}) => (
							<div className='custom-header'>
								<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
									&lt;
								</button>
								<span>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
								<button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
									&gt;
								</button>
							</div>
						)}
					/>
				</div>
			)}
		</div>
	)
}
