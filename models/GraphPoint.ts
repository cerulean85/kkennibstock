export interface GraphPoint { x: string, y: number }

export const getEmpty = () => {
	const empty: GraphPoint = { x: '', y: 0 }
	return empty;
};