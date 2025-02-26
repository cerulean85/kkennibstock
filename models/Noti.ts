export interface Noti {
	id: string,
	title: string,
	date: string,
	description: string
}

export const getEmpty = () => {
	const empty: Noti = { id: '', title: '', date: '', description: '' }
	return empty;
};