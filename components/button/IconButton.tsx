type IconButtonProps = {
  imageSrc: string;
	width?: number;
	height?: number;
	onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({ imageSrc, width, height, onClick }) => (
	<button
		type="button"
		onClick={onClick}
		className="flex justify-center items-center p-2 rounded hover:bg-gray-200 transition">
	<img
		src={imageSrc}
		width={width || 20}
		height={height || 20}
	></img>
</button>
);

export default IconButton;