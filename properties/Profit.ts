export interface ProfitProp {
  sumPurchasePrice: number;
  sumPurchasePrice_Won: number;
  sumPurchasePriceViewData: number;

  sumValuationPrice: number;
  sumValuationPrice_Won: number;
  sumValuationPriceViewData: number;

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
    profit.sumPurchasePriceViewData = profit.sumPurchasePrice;
    profit.sumValuationPriceViewData = profit.sumValuationPrice;
    profit.gainPriceViewData = profit.gainPrice;
  } else {
    profit.sumPurchasePriceViewData = profit.sumPurchasePrice_Won;
    profit.sumValuationPriceViewData = profit.sumValuationPrice_Won;
    profit.gainPriceViewData = profit.gainPrice_Won;
  }
  return profit;
};

export const createProfit = () => {
  return {
    sumPurchasePrice: 0,
    sumPurchasePrice_Won: 0,
    sumPurchasePriceViewData: 0,

    sumValuationPrice: 0,
    sumValuationPrice_Won: 0,
    sumValuationPriceViewData: 0,

    gainPrice: 0,
    gainPrice_Won: 0,
    gainPriceViewData: 0,

    gainRate: 0,
  };
};
