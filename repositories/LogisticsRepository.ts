import { Alarm, getEmpty } from '@/models/Alarm';
import repo from './repo.json'
import {
	reqGet
} from "./req"

export class LogisticsRepository {
	async getAlarmList(): Promise<Alarm[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: Alarm[] = rst.alarmList;
			return list;
		}

		return repo.dummy.alarmList;
	}
}