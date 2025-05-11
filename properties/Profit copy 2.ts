export interface ProfitProp {
	purchaseAmount: number;
	marketValue: number;
	purchaseAmount_Won: number;
	marketValue_Won: number;
	gainPrice: number;
	gainPrice_Won: number;
	gainRate: number;
}

export const createProfit = () => {
	return { purchaseAmount: 0, marketValue: 0 }
}