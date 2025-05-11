import { reqGet } from "./req"

export class ProfitRepository {
	private toppath: string = "stocks";
	async getProfitData() {
		const pathname = "profit";
		const response = await reqGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	async getMyStockData() {
		const pathname = "my-stock";
		const response = await reqGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	async getProfitTrendData() {
		const pathname = "profit-trend";
		const response = await reqGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	async getMonthlyProfitTrendData() {
		const pathname = "monthly-profit-trend";
		const response = await reqGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	
}