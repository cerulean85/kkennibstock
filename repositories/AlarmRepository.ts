import { Alarm, getEmpty } from '@/models/Alarm';
import repo from './repo.json'
import {
	reqGet
} from "./req"

export class AlarmRepository {
	async getAlarmList(): Promise<Alarm[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: Alarm[] = rst.alarmList;
			return list;
		}

		return repo.dummy.alarmList;
	}

	async getAlarmDetail(id: string): Promise<Alarm> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const item: Alarm = rst.alarm;
			return item;
		}

		for ( const item of repo.dummy.alarmList) {
			if (item.id === id) {
				return item;
			}
		}

		return getEmpty();
	}
}