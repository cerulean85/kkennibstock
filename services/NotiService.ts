import { Noti } from "@/models/Noti";
import { NotiRepository } from "@/repositories/NotiRepository";

export class NotiService {
	private repo: NotiRepository;

	constructor() {
		this.repo = new NotiRepository();
	}

	async getNotiList(): Promise<Noti[]> {
		return await this.repo.getNotiList();
	}

	async getNotiDetail(id: string): Promise<Noti> {
		return await this.repo.getNotiDetail(id);
	}
}