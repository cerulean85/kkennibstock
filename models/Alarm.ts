import { AlarmManual } from "./AlarmManual";
import { AlarmPerson } from "./AlarmPerson";

export interface Alarm {
	id: string,
	code: string,
	date: string,
	manuals: AlarmManual[];
	action: string;
	people: AlarmPerson[];
}

export const getEmpty = () => {
	const empty: Alarm = { id: '', code: '', date: '', manuals: [], action: '', people: [] }
	return empty;
};