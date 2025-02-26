import { Noti, getEmpty } from '@/models/Noti';
import repo from './repo.json'
import {
	reqGet
} from "./req"

export class NotiRepository {
	async getNotiList(): Promise<Noti[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: Noti[] = rst.notiList;
			return list;
		}

		return repo.dummy.notiList;
	}

	async getNotiDetail(id: string): Promise<Noti> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const item: Noti = rst.noti;
			return item;
		}

		for ( const item of repo.dummy.notiList) {
			if (item.id === id) {
				return item;
			}
		}

		return getEmpty();
	}
}