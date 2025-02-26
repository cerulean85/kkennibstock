'use client'
import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image'

export default function DateRangePicker() {
	const [startDate, setStartDate] = useState<Date | null>(new Date());
	const [endDate, setEndDate] = useState<Date | null>(new Date());
	return (
		<div className='daterange-picker d-flex align-items-center border border-black'>
			<Image className='ms-2' src="/images/icon/ic_calendar.svg" width={24} height={24} alt='날짜선택'/>
			<DatePicker
				className="datepicker p-2"
				selected={startDate}
				onChange={(date) => setStartDate(date)}
				dateFormat="yyyy-MM-dd" />
			-
			<DatePicker
				className="datepicker p-2"
				selected={endDate}
				onChange={(date) => setEndDate(date)}
				dateFormat="yyyy-MM-dd" />
			
			<div className='datepicker-btn d-flex justify-content-center align-items-center'>
				조회
			</div>
		</div>

	);
}