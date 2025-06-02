import { fetchGet, fetchMetricsGet, fetchMetricsPost } from "./req"

export class MetricsRepository {
	private toppath: string = "metrics";
	async getWonDollarRate() {
		const pathname = "currency";
		const response = await fetchGet(`${this.toppath}/${pathname}`, pathname);
		return response;
	}		
	async getMetricsData(tickersPeriods: any) {
		const pathname = "metrics";
		const response = await fetchMetricsPost(`${pathname}`, tickersPeriods, pathname);
		return response;

	}
	async getVixData() {
		const pathname = "vix";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}
	async getVxnData() {
		const pathname = "vxn";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}
	async getSp500Data() {
		const pathname = "sp500";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}
	async getNdxData() {
		const pathname = "ndx";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}
	async getUsdkrData() {
		const pathname = "usdkr";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}
	async getGoldData() {
		const pathname = "gold";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}	
	async getOilData() {
		const pathname = "oil";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}
	async getUs10yData() {
		const pathname = "us10y";
		const response = await fetchMetricsGet(`${pathname}`, pathname);
		return response;
	}	
}