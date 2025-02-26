import { GraphPoint } from "@/models/GraphPoint";
import { Noti } from "@/models/Noti";
import { ShipRepository } from "@/repositories/ShipRepository";

export class ShipService {
	private repo: ShipRepository;

	constructor() {
		this.repo = new ShipRepository();
	}

	async getSaveTrendList(): Promise<GraphPoint[]> {
		return await this.repo.getSaveTrendList();
	}

	async getCurrentShipList(): Promise<any[]> {
		return await this.repo.getCurrentShipList();
	}

	async getImportantItemList(): Promise<GraphPoint[]> {
		return await this.repo.getImportantItemList();
	}

	async getStackerCraneSaveList(): Promise<any[]> {
		return await this.repo.getStackerCraneSaveList();
	}

	async getGantrySaveList(): Promise<any[]> {
		return await this.repo.getGantrySaveList();
	}
}