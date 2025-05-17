import { ProfitRepository } from "@/repositories/ProfitRepository";
import { BaseService } from "./BaseService";
import { createProfit, ProfitProp, ProfitTrendProp, updatePriceViewDataByCurrency } from "@/properties/Profit";
import { updateStockPriceByCurrency, StockProp } from "@/properties/Stock";

export class ProfitService extends BaseService {
	private repo: ProfitRepository;

	constructor() {
		super();
		this.repo = new ProfitRepository();
	}

	// async getProfitData(toDollar: boolean) {
	// 	const response = await this.repo.getProfitData();
	// 	const result: ProfitProp = this.getData(response);
	// 	if (result) {
	// 		updatePriceViewDataByCurrency(result, toDollar);
	// 		return result;
	// 	}
	// 	return createProfit();
	// }

	async getStockHoldingData() {
		const response = await this.repo.getStockHoldingData();
		const result = this.getData(response);
		return result;
	}

	async getValudationData(tickers: any) {
		const response = await this.repo.getValudationData(tickers);
		const result = this.getData(response);
		return result;
	}

	async getProfitTrendData() {
		const response = await this.repo.getProfitTrendData();
		const result: ProfitTrendProp[] = this.getData(response);
		if (!result) return [];
		return result;
	}

	async getMonthlyProfitTrendData() {
		const response = await this.repo.getMonthlyProfitTrendData();
		const result: ProfitTrendProp[] = this.getData(response);
		if (!result) return [];
		return result;
	}

}