import { GraphPoint, getEmpty } from '@/models/GraphPoint';
import repo from './repo.json'
import {
	reqGet
} from "./req"

export class ShipRepository {
	async getCurrentShipList(): Promise<GraphPoint[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: GraphPoint[] = rst.notiList;
			return list;
		}

		return repo.dummy.currentShipList;
	}

	async getImportantItemList(): Promise<any[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: GraphPoint[] = rst.notiList;
			return list;
		}

		return repo.dummy.importantItemList;
	}

	async getSaveTrendList(): Promise<GraphPoint[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: GraphPoint[] = rst.notiList;
			return list;
		}

		return repo.dummy.saveTrendList;
	}	

	async getStackerCraneSaveList(): Promise<any[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: any[] = rst.notiList;
			return list;
		}

		return repo.dummy.equipmentSaveList.StackerCrane;
	}		

	async getGantrySaveList(): Promise<any[]> {
		if (repo.deployment) {
			const res = await reqGet("something");
			const rst: any = res.json();
			const list: any[] = rst.notiList;
			return list;
		}

		return repo.dummy.equipmentSaveList.Gantry;
	}		
}