import { MetricsRepository } from "@/repositories/MetricsRepository";
import { BaseService } from "./BaseService";

export class MetricsService extends BaseService{
	private repo: MetricsRepository;

	constructor() {
		super();
		this.repo = new MetricsRepository();
	}
	async getWonDollarRate() {
		const response = await this.repo.getWonDollarRate();
		const result = this.getData(response);
		if (result) return result;
		return 0;
	}
	async getMetricsData(tickersPeriods: any) {
		const response = await this.repo.getMetricsData(tickersPeriods);
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getVixData() {
		const response = await this.repo.getVixData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getVxnData() {
		const response = await this.repo.getVxnData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getSp500Data() {
		const response = await this.repo.getSp500Data();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getNdxData() {
		const response = await this.repo.getNdxData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getUsdkrData() {
		const response = await this.repo.getUsdkrData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getGoldData() {
		const response = await this.repo.getGoldData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}	
	async getOilData() {
		const response = await this.repo.getOilData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	async getUs10yData() {
		const response = await this.repo.getUs10yData();
		const result = this.getData(response);
		if (!result) return [];
		return result;
	}
	
}