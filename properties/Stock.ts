export interface StockProp {
	name: string;
	ticker: string;
	quantity: number;
	currentPrice: number;
	averagePurchasePrice: number;
	purchaseAmount: number;
	valuation: number;
	currentPrice_Won: number;
	averagePurchasePrice_Won: number;
	purchaseAmount_Won: number;
	valuation_Won: number;
	currentPriceViewData: number;
	averagePurchasePriceViewData: number;
	purchaseAmountViewData: number;
	valuationViewData: number;
	weight: number;
}

export const updateStockPriceByCurrency = (stock: StockProp, toDollar: boolean) => {
	if (toDollar) {
		stock.currentPriceViewData = stock.currentPrice;
		stock.averagePurchasePriceViewData = stock.averagePurchasePrice;
		stock.purchaseAmountViewData = stock.purchaseAmount;
		stock.valuationViewData = stock.valuation;
	} else {
		stock.currentPriceViewData = stock.currentPrice_Won;
		stock.averagePurchasePriceViewData = stock.averagePurchasePrice_Won;
		stock.purchaseAmountViewData = stock.purchaseAmount_Won;
		stock.valuationViewData = stock.valuation_Won;
	}
}

export const updateStockListPriceByCurrency = (stockList: StockProp[], toDollar: boolean) => {
	stockList.map((stock: StockProp) => {
		updateStockPriceByCurrency(stock, toDollar);
	});
	return stockList;
}

export const createStock = () => {
	return { 
		name: '',
		ticker: '',
		quantity: 0,
		currentPrice: 0,
		averagePurchasePrice: 0,
		purchaseAmount: 0,
		valuation: 0,
		currentPrice_Won: 0,
		averagePurchasePrice_Won: 0,
		purchaseAmount_Won: 0,
		valuation_Won: 0,
		currentPriceViewData: 0,
		averagePurchasePriceViewData: 0,
		purchaseAmountViewData: 0,
		valuationViewData: 0
	}
}