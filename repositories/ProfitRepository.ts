import { reqGet, reqHappGet, reqMetricsGet, reqMetricsPost, reqHappPost } from "./req"

export class ProfitRepository {
	private toppath: string = "stocks";
	async getProfitData() {
		const pathname = "profit";
		const response = await reqGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	async getStockHoldingData() {
		const pathname = "stock-holding";
		const response = await reqHappGet(`${pathname}/all`, `${pathname}/all`);
		return response;
	}

	async getValudationData(tickers: any) {
		const pathname = "latest-prices";
		const response = await reqMetricsPost(`${pathname}`, tickers, `${pathname}`);
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