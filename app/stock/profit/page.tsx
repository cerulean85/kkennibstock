"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import EChartsComponent from "@/graphs/EChartsComponent";
import { ProfitService } from "@/services/ProfitService";
import { createProfit, ProfitProp, updatePriceViewDataByCurrency } from "@/properties/Profit";
import { updateStockListPriceByCurrency, StockProp } from "@/properties/Stock";
import ToggleSwitch from "@/components/ToggleSwitch";

const TextInput = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`cursor-pointer text-center border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);

// 금액 표시용 컴포넌트
const CurrencyValue = ({ value, isDollar }: { value: number; isDollar: boolean }) => (
  <span>{isDollar ? value.toLocaleString() : Math.floor(value).toLocaleString()}</span>
);

const MoneyInput = ({
  value,
  isDollar,
  onChange,
  onKeyDown,
  className = "",
}: {
  value: number;
  isDollar: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
}) => {
  // 표시용 문자열
  const displayValue = isDollar
    ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.floor(Number(value)).toLocaleString();

  return (
    <input
      type="text"
      value={displayValue}
      className={`cursor-pointer text-center border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      onChange={e => {
        // 입력값에서 콤마 제거 후 숫자 변환
        const raw = e.target.value.replace(/,/g, "");
        const v = isDollar ? Number(raw) : Math.floor(Number(raw));
        onChange({
          ...e,
          target: { ...e.target, value: v.toString() },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      onKeyDown={onKeyDown}
    />
  );
};

const Profit = () => {
  const [profit, setProfit] = useState<ProfitProp>(createProfit());
  const [profitViewToDollar, setProfitViewToDollar] = useState(true);
  const [stockHoldingList, setStockHoldingList] = useState<StockProp[] | null>(null);
  const [stockPriceViewToDollar, setMyStockViewToDollar] = useState(true);
  const [profitTrendChartOption, setProfitTrendChartOption] = useState<any>({});
  const [monthlyProfitTrendChartOption, setMonthlyProfitTrendChartOption] = useState<any>({});
  const [myStockWeightChartDataOption, setMyStockWeightChartDataOption] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStockHoldingData(), fetchProfitTrendData(), fetchMonthlyProfitTrendData()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDerivedData = (tickers: string[], stocks: StockProp[], valuationObj: any) => {
    const dollarPrice = valuationObj["USDKRW=X"];
    let sumPurchasePrice = 0;
    let sumValuationPrice = 0;

    stocks.forEach((stock: StockProp) => {
      sumPurchasePrice += stock.purchasePrice * stock.quantity;
      sumValuationPrice += valuationObj[stock.ticker] * stock.quantity;
    });

    const sumPurchasePrice_Won = sumPurchasePrice * dollarPrice;
    const sumValuationPrice_Won = sumValuationPrice * dollarPrice;
    const gainPrice = sumValuationPrice - sumPurchasePrice;
    const gainPrice_Won = gainPrice * dollarPrice;
    const gainRate = (gainPrice / sumPurchasePrice) * 100;

    const newProfit: ProfitProp = {
      ...profit,
      sumPurchasePrice,
      sumPurchasePrice_Won,
      sumValuationPrice,
      sumValuationPrice_Won,
      gainPrice,
      gainPrice_Won,
      gainRate,
    };
    updatePriceViewDataByCurrency(newProfit, profitViewToDollar);
    setProfit(newProfit);

    tickers.map((ticker: string) => {
      const stock = stocks.find(s => s.ticker === ticker);
      if (stock) {
        stock.valuationPrice = valuationObj[ticker];
        stock.valuationPrice_Won = stock.valuationPrice * dollarPrice;
        stock.purchasePrice_Won = stock.purchasePrice * dollarPrice;
        stock.totalValuationPrice = stock.valuationPrice * stock.quantity;
        stock.totalValuationPrice_Won = stock.valuationPrice_Won * stock.quantity;
        stock.totalPurchasePrice = stock.purchasePrice * stock.quantity;
        stock.totalPurchasePrice_Won = stock.purchasePrice_Won * stock.quantity;
        stock.weight = (stock.totalValuationPrice / sumPurchasePrice) * 100;
      }
    });

    updateStockListPriceByCurrency(stocks, stockPriceViewToDollar);
    setStockHoldingList(stocks);
  };

  const fetchStockHoldingData = async () => {
    const serv = new ProfitService();
    const stockHoldingData: StockProp[] = await serv.getStockHoldingData();

    const tickersList: string[] = stockHoldingData.map((item: StockProp) => item.ticker);

    console.log("tickersList: ", tickersList);

    const valuationData = await serv.getValudationData({ tickers: tickersList });

    updateDerivedData(tickersList, stockHoldingData, valuationData);

    const stockHoldingWeightChartData: any[] = [];
    stockHoldingData.map((item: StockProp) => {
      const chartData = { name: item.name, value: item.weight };
      stockHoldingWeightChartData.push(chartData);
    });

    const _myStockWeightChartDataOption = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "horizontal", // 범례를 수평으로 설정
        bottom: 20,
        left: "center", // 범례를 중앙에 배치
        data: stockHoldingWeightChartData.map(item => item.name),
      },
      series: [
        {
          // name: '시장 점유율',
          type: "pie",
          radius: "70%",
          center: ["50%", "35%"],
          data: stockHoldingWeightChartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    setMyStockWeightChartDataOption(_myStockWeightChartDataOption);
    // setStockHoldingList(stockHoldingData);
  };

  const fetchProfitTrendData = async () => {
    const serv = new ProfitService();
    const profitTrendData = await serv.getProfitTrendData();
    let xAxis = profitTrendData.map((obj: any) => obj.date);
    let yAxis = profitTrendData.map((obj: any) => obj.rate);
    let trendChartData = {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      grid: { top: "20px", bottom: "15%" },
      // legend: { data: ['수익률'], right: '5%', top: '4%' },
      xAxis: { type: "category", data: xAxis },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: Math.min(...yAxis),
          max: Math.max(...yAxis),
        },
      ],
      series: [
        {
          name: "수익률",
          type: "line",
          data: yAxis,
          emphasis: { focus: "series" },
          itemStyle: { color: "#0D6EFD" },
          yAxisIndex: 0,
        },
      ],
    };
    setProfitTrendChartOption(trendChartData);
  };

  const fetchMonthlyProfitTrendData = async () => {
    const serv = new ProfitService();
    const profitTrendData = await serv.getMonthlyProfitTrendData();
    let xAxis = profitTrendData.map((obj: any) => obj.date);
    let yAxis = profitTrendData.map((obj: any) => obj.profit);
    const yMinProfit = Math.min(...yAxis);
    let trendChartData = {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      grid: { top: "20px", bottom: "12%", left: "15%" },
      // legend: { data: ['수익률'], right: '5%', top: '4%' },
      xAxis: { type: "category", data: xAxis },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: yMinProfit < 0 ? yMinProfit * 4 : yMinProfit,
          max: Math.max(...yAxis),
        },
      ],
      series: [
        {
          name: "수익",
          type: "line",
          data: yAxis,
          emphasis: { focus: "series" },
          itemStyle: { color: "#FB122F" },
          yAxisIndex: 0,
        },
      ],
    };
    setMonthlyProfitTrendChartOption(trendChartData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const newProfit = updatePriceViewDataByCurrency({ ...profit }, profitViewToDollar);
    setProfit(newProfit); // 새로운 객체로 교체
  }, [profitViewToDollar]);

  useEffect(() => {}, [stockHoldingList]);

  useEffect(() => {
    if (!stockHoldingList) return;
    updateStockListPriceByCurrency(stockHoldingList, stockPriceViewToDollar);
    setStockHoldingList(stockHoldingList ? [...stockHoldingList] : []);
  }, [stockPriceViewToDollar]);

  const updateStockField = (index: number, field: keyof StockProp, value: any) => {
    setStockHoldingList(prev => (prev ?? []).map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const requestUpdateValue = (index: number, field: keyof StockProp, value: any) => {
    console.log(`${index}: ${field} - ${value}`);
  };

  const handleStockInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: keyof StockProp) => {
    if (e.key === "Enter") {
      const newValue = (e.target as HTMLInputElement).value;
      requestUpdateValue(index, field, newValue);
      (e.target as HTMLInputElement).blur();
    }
  };
  return (
    <div className="space-y-8 px-2 pt-3 min-h-screen">
      {/* 페이지 헤더 */}
      <DashboardHeader
        title="Profit Dashboard"
        description="Monitor your investment performance and holdings"
        onRefresh={fetchData}
        loading={loading}
      />
      {/* 평가손익 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">평가손익</h2>
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">달러로 보기</label>
            <ToggleSwitch enabled={profitViewToDollar} setEnabled={setProfitViewToDollar} />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">매입금액({profitViewToDollar ? "$" : "원"})</div>
            <div className="text-2xl font-bold text-gray-900">
              <CurrencyValue value={profit.sumPurchasePriceViewData} isDollar={profitViewToDollar} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">평가금액({profitViewToDollar ? "$" : "원"})</div>
            <div className="text-2xl font-bold text-gray-900">
              <CurrencyValue value={profit.sumValuationPriceViewData} isDollar={profitViewToDollar} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">손익({profitViewToDollar ? "$" : "원"})</div>
            <div className={`text-2xl font-bold ${profit.gainPriceViewData >= 0 ? "text-green-600" : "text-red-600"}`}>
              <CurrencyValue value={profit.gainPriceViewData} isDollar={profitViewToDollar} />
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 mb-2">손익(%)</div>
            <div className={`text-2xl font-bold ${profit.gainRate >= 0 ? "text-green-600" : "text-red-600"}`}>
              {profit.gainRate.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>{" "}
      {/* 종목비중 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">종목비중</h2>
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">달러로 보기</label>
            <ToggleSwitch enabled={stockPriceViewToDollar} setEnabled={setMyStockViewToDollar} />
          </div>
        </div>

        {!myStockWeightChartDataOption ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        ) : (
          <div className="w-full h-96 mb-6">
            <EChartsComponent width={"100%"} height={"100%"} chartData={myStockWeightChartDataOption} />
          </div>
        )}

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  종목명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">티커</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  매입금액({stockPriceViewToDollar ? "$" : "원"})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평가금액({stockPriceViewToDollar ? "$" : "원"})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비중(%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!stockHoldingList ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : stockHoldingList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    보유 종목이 없습니다.
                  </td>
                </tr>
              ) : (
                stockHoldingList.map((d: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextInput
                        type="text"
                        value={d.name}
                        onChange={e => updateStockField(i, "name", e.target.value)}
                        onKeyDown={e => handleStockInputKeyDown(e, i, "name")}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextInput
                        type="text"
                        value={d.ticker}
                        onChange={e => updateStockField(i, "ticker", e.target.value)}
                        onKeyDown={e => handleStockInputKeyDown(e, i, "ticker")}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MoneyInput
                        value={d.totalPurchasePriceViewData}
                        isDollar={stockPriceViewToDollar}
                        onChange={e => updateStockField(i, "totalPurchasePriceViewData", e.target.value)}
                        onKeyDown={e => handleStockInputKeyDown(e, i, "totalPurchasePriceViewData")}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MoneyInput
                        value={d.totalValuationPriceViewData}
                        isDollar={stockPriceViewToDollar}
                        onChange={e => updateStockField(i, "totalValuationPriceViewData", e.target.value)}
                        onKeyDown={e => handleStockInputKeyDown(e, i, "totalValuationPriceViewData")}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextInput
                        type="text"
                        value={Number(d.quantity).toLocaleString()}
                        onChange={e => updateStockField(i, "quantity", Number(e.target.value.replace(/,/g, "")))}
                        onKeyDown={e => handleStockInputKeyDown(e, i, "quantity")}
                        className="w-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TextInput
                        type="text"
                        value={Number(d.weight).toFixed(2)}
                        onChange={e => updateStockField(i, "weight", Number(e.target.value))}
                        onKeyDown={e => handleStockInputKeyDown(e, i, "weight")}
                        className="w-full"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>{" "}
      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">수익률 변화(%)</h3>
          <div className="h-80">
            {profitTrendChartOption && Object.keys(profitTrendChartOption).length > 0 ? (
              <EChartsComponent width={"100%"} height={"100%"} chartData={profitTrendChartOption} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">월간 수익(원화)</h3>
          <div className="h-80">
            {monthlyProfitTrendChartOption && Object.keys(monthlyProfitTrendChartOption).length > 0 ? (
              <EChartsComponent width={"100%"} height={"100%"} chartData={monthlyProfitTrendChartOption} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profit;
