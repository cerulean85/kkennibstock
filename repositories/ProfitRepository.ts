import { fetchGet, fetchHappGet, fetchMetricsGet, fetchMetricsPost, fetchHappPost } from "./req"

export class ProfitRepository {
	private toppath: string = "stocks";
	async getProfitData() {
		const pathname = "profit";
		const response = await fetchGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	async getStockHoldingData() {
		const pathname = "stock-holding";
		const response = await fetchHappGet(`${pathname}/all`, `${pathname}/all`);
		return response;
	}

	async getValudationData(tickers: any) {
		const pathname = "latest-prices";
		const response = await fetchMetricsPost(`${pathname}`, tickers, `${pathname}`);
		return response;
	}

	async getProfitTrendData() {
		const pathname = "profit-trend";
		const response = await fetchGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	async getMonthlyProfitTrendData() {
		const pathname = "monthly-profit-trend";
		const response = await fetchGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}

	
}