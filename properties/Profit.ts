export interface ProfitProp {
	purchaseAmount: number;
	purchaseAmount_Won: number;
	purchaseAmountViewData: number;
	
	marketValue: number;	
	marketValue_Won: number;
	marketValueViewData: number;	

	gainPrice: number;
	gainPrice_Won: number;
	gainPriceViewData: number;

	gainRate: number;
}

export interface ProfitTrendProp {
	date: string;
	rate: number;
}

export const updatePriceViewDataByCurrency = (profit: ProfitProp, toDollar: boolean) => {
	if (toDollar === true) {
		profit.purchaseAmountViewData = profit.purchaseAmount;
		profit.marketValueViewData = profit.marketValue;
		profit.gainPriceViewData = profit.gainPrice;
	} else {
		profit.purchaseAmountViewData = profit.purchaseAmount_Won;
		profit.marketValueViewData = profit.marketValue_Won;
		profit.gainPriceViewData = profit.gainPrice_Won;
	}
	return profit;
}

export const createProfit = () => {
	return { 
		purchaseAmount: 0,
		purchaseAmount_Won: 0,
		purchaseAmountViewData: 0,
		
		marketValue: 0,
		marketValue_Won: 0,
		marketValueViewData: 0,

		gainPrice: 0,
		gainPrice_Won: 0,
		gainPriceViewData: 0,

		gainRate: 0,
	}
}