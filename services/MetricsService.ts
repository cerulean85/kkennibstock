import { GraphPoint } from "@/models/GraphPoint";
import { Noti } from "@/models/Noti";
import { MetricsRepository } from "@/repositories/MetricsRepository";

export class MetricsService {
	private repo: MetricsRepository;

	constructor() {
		this.repo = new MetricsRepository();
	}
	async getVixData() {
		return await this.repo.getVixData();
	}
}