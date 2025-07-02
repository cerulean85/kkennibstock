export interface StockProp {
  name: string;
  ticker: string;
  quantity: number;
  weight: number;

  valuationPrice: number;
  valuationPrice_Won: number;
  purchasePrice: number;
  purchasePrice_Won: number;

  totalValuationPrice: number;
  totalValuationPrice_Won: number;
  totalPurchasePrice: number;
  totalPurchasePrice_Won: number;

  valuationPriceViewData: number;
  purchasePriceViewData: number;
  totalPurchasePriceViewData: number;
  totalValuationPriceViewData: number;
}

export const updateStockPriceByCurrency = (stock: StockProp, toDollar: boolean) => {
  if (toDollar) {
    stock.valuationPriceViewData = stock.valuationPrice;
    stock.purchasePriceViewData = stock.purchasePrice;
    stock.totalPurchasePriceViewData = stock.totalPurchasePrice;
    stock.totalValuationPriceViewData = stock.totalValuationPrice;
  } else {
    stock.valuationPriceViewData = stock.valuationPrice_Won;
    stock.purchasePriceViewData = stock.purchasePrice_Won;
    stock.totalPurchasePriceViewData = stock.totalPurchasePrice_Won;
    stock.totalValuationPriceViewData = stock.totalValuationPrice_Won;
  }
};

export const updateStockListPriceByCurrency = (stockList: StockProp[], toDollar: boolean) => {
  stockList.map((stock: StockProp) => {
    updateStockPriceByCurrency(stock, toDollar);
  });
};

export const createStock = () => {
  return {
    name: "",
    ticker: "",
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
    valuationViewData: 0,
  };
};
