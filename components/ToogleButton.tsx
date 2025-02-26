"use client";
import React, { useState } from 'react';
import Image from "next/image";
import { Dispatch } from '@reduxjs/toolkit';

interface Size {
	width: string;
	height: string;
}

interface NextImageSize {
	width: number;
	height: number;
}


interface TooggleButtonProps {
	releasedImage: string;
	pressedImage: string;
	buttonSize: Size;
	imageSize: NextImageSize;
	releasedBgColor: string,
	pressedBgColor: string,
	message: string;
	onLoader: any;
	selectedState: boolean;
	setSelectedState: any;
}

export default function ToggleButton({
	releasedImage,
	pressedImage,
	buttonSize,
	imageSize,
	releasedBgColor,
	pressedBgColor,
	message,
	onLoader,
	selectedState,
	setSelectedState
} : TooggleButtonProps) {

	// const [released, setReleased] = useState(releaseState);
	const onClick = () => {

		if (!selectedState) {
			onLoader();
		}

		const currentState = !selectedState;
		setSelectedState(currentState);
	}

	return (
		<div 
			onClick={onClick}
			className="d-flex align-items-center justify-content-center"
			style={{ 
				width: buttonSize.width,
				height: buttonSize.height,
				cursor: 'pointer',
				backgroundColor: (selectedState ? pressedBgColor : releasedBgColor),
				borderTopLeftRadius: '10px',
				borderTopRightRadius: '10px'
			}}>
			<Image 
				width={imageSize.width}
				height={imageSize.height} 
				src={selectedState ? pressedImage : releasedImage}
				alt={message}/>
		</div>
	);
}