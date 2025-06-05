'use client'
import React, { useState, useEffect } from 'react';
import EChartsComponent from '@/graphs/EChartsComponent';
import { ProfitService } from '@/services/ProfitService';
import { createProfit, ProfitProp, updatePriceViewDataByCurrency } from '@/properties/Profit';
import { updateStockListPriceByCurrency, StockProp } from '@/properties/Stock';
import ToggleSwitch from '@/components/ToggleSwitch';
import styled from 'styled-components';
import { setPriority } from 'os';

const TextInput = styled.input`
  cursor: pointer;
  text-align: center;
`

// 금액 표시용 컴포넌트
const CurrencyValue = ({
  value,
  isDollar,
}: {
  value: number;
  isDollar: boolean;
}) => (
  <span>
    {isDollar
      ? value.toLocaleString()
      : Math.floor(value).toLocaleString()}
  </span>
);

const MoneyInput = ({
  value,
  isDollar,
  onChange,
  onKeyDown,
}: {
  value: number;
  isDollar: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  // 표시용 문자열
  const displayValue = isDollar
    ? Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.floor(Number(value)).toLocaleString();

  return (
    <TextInput
      type="text"
      value={displayValue}
      onChange={e => {
        // 입력값에서 콤마 제거 후 숫자 변환
        const raw = e.target.value.replace(/,/g, '');
        const v = isDollar
          ? Number(raw)
          : Math.floor(Number(raw));
        onChange({
          ...e,
          target: { ...e.target, value: v.toString() }
        } as React.ChangeEvent<HTMLInputElement>);
      }}
      onKeyDown={onKeyDown}
    />
  );
};

const Profit = () => {
  const [profit, setProfit] = useState<ProfitProp>(createProfit());
  const [profitViewToDollar, setProfitViewToDollar] = useState(true);
  const [stockHoldingList, setStockHoldingList] = useState<StockProp[]|null>(null);
  const [stockPriceViewToDollar, setMyStockViewToDollar] = useState(true);
  const [profitTrendChartOption, setProfitTrendChartOption] = useState<any>({});
  const [monthlyProfitTrendChartOption, setMonthlyProfitTrendChartOption] = useState<any>({});
  const [myStockWeightChartDataOption, setMyStockWeightChartDataOption] = useState<any|null>(null);


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
      gainRate
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
  }

  const fetchStockHoldingData = async () => {

    const serv = new ProfitService();                
    const stockHoldingData: StockProp[]  = await serv.getStockHoldingData();    
    
    const tickersList: string[] = stockHoldingData.map((item: StockProp) => item.ticker)

    console.log("tickersList: ", tickersList);

    const valuationData = await serv.getValudationData({ "tickers": tickersList });

    updateDerivedData(tickersList, stockHoldingData, valuationData);

    const stockHoldingWeightChartData: any[] = [];
    stockHoldingData.map((item: StockProp) => {
      const chartData = { name: item.name, value: item.weight }
      stockHoldingWeightChartData.push(chartData);      
    })

    const _myStockWeightChartDataOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal', // 범례를 수평으로 설정
        bottom: 20,
        left: 'center', // 범례를 중앙에 배치
        data: stockHoldingWeightChartData.map(item => item.name)
      },
      series: [
        {
          // name: '시장 점유율',
          type: 'pie',
          radius: '70%',
          center: ['50%', '35%'],
          data: stockHoldingWeightChartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };    
    setMyStockWeightChartDataOption(_myStockWeightChartDataOption);
    // setStockHoldingList(stockHoldingData);
  }

  const fetchProfitTrendData = async () => {
    const serv = new ProfitService();   
    const profitTrendData = await serv.getProfitTrendData();
    let xAxis = profitTrendData.map((obj: any) => obj.date);
    let yAxis = profitTrendData.map((obj: any) => obj.rate);        
    let trendChartData = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { top: '20px', bottom: '15%' },
      // legend: { data: ['수익률'], right: '5%', top: '4%' },
      xAxis: { type: 'category', data: xAxis, },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          min: Math.min(...yAxis),
          max: Math.max(...yAxis)
        }
      ],
      series: [
        {
          name: '수익률',
          type: 'line',
          data: yAxis,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#0D6EFD' },
          yAxisIndex: 0
        }
      ],
    };
    setProfitTrendChartOption(trendChartData);
  }

  const fetchMonthlyProfitTrendData = async () => {
    const serv = new ProfitService();   
    const profitTrendData = await serv.getMonthlyProfitTrendData();
    let xAxis = profitTrendData.map((obj: any) => obj.date);
    let yAxis = profitTrendData.map((obj: any) => obj.profit);        
    const yMinProfit = Math.min(...yAxis);
    let trendChartData = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { top: '20px', bottom: '12%', left: '15%' },
      // legend: { data: ['수익률'], right: '5%', top: '4%' },
      xAxis: { type: 'category', data: xAxis, },
      yAxis: [
        {
          type: 'value',
          position: 'left',
          min: (yMinProfit < 0) ?  (yMinProfit * 4) : yMinProfit,
          max: Math.max(...yAxis)
        }
      ],
      series: [
        {
          name: '수익',
          type: 'line',
          data: yAxis,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#FB122F' },
          yAxisIndex: 0,
        }
        
      ],
    };
    setMonthlyProfitTrendChartOption(trendChartData);
  }

  useEffect(() => {
    fetchStockHoldingData();
    fetchProfitTrendData();
    fetchMonthlyProfitTrendData();
  }, [])

  useEffect(() => {
    const newProfit = updatePriceViewDataByCurrency({ ...profit }, profitViewToDollar);
    setProfit(newProfit);  // 새로운 객체로 교체
  }, [profitViewToDollar])

  useEffect(() => {


  }, [stockHoldingList])

  useEffect(() => {
    if (!stockHoldingList) return;
    updateStockListPriceByCurrency(stockHoldingList, stockPriceViewToDollar);
    setStockHoldingList(stockHoldingList ? [...stockHoldingList] : []);
  }, [stockPriceViewToDollar])

  const updateStockField = (index: number, field: keyof StockProp, value: any) => {
    setStockHoldingList(prev =>
      (prev ?? []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const requestUpdateValue = (index: number, field: keyof StockProp, value: any) => {
    console.log(`${index}: ${field} - ${value}`);
  }

  const handleStockInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    field: keyof StockProp
  ) => {
    if (e.key === 'Enter') {      
      const newValue = (e.target as HTMLInputElement).value;
      requestUpdateValue(index, field, newValue);      
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className='pb-3'>
      <div className='flex px-2 h-auto bg-[var(--main-bg-color)]'>
        <div className='mt-2' style={{width: '100%', height: '100%' }}>          
          <div className='series-chart-card mt-3 w-full'>
            <div className='title flex justify-between'>
              <label>평가손익</label>
              <div className='flex items-center'>
                <label className='me-2 text-base'>달러로 보기</label>
                <ToggleSwitch 
                  enabled={profitViewToDollar}
                  setEnabled={setProfitViewToDollar}
                  ></ToggleSwitch>
              </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 gap-2 px-6 sm:flex sm:flex-row sm:justify-between sm:px-20 mt-4 text-center">
              <div className="metric">
                <div className="font-bold text-sm md:text-lg">매입금액({profitViewToDollar ? '$' : '원'})</div>
                <div className="font-bold text-lg md:text-3xl">
                  <CurrencyValue
                    value={profit.sumPurchasePriceViewData}
                    isDollar={profitViewToDollar}
                  />
                </div>
              </div>
              <div className="metric">
                <div className="font-bold text-sm md:text-lg">평가금액({profitViewToDollar ? '$' : '원'})</div>
                <div className="font-bold text-lg md:text-3xl">
                  <CurrencyValue
                    value={profit.sumValuationPriceViewData}
                    isDollar={profitViewToDollar}
                  />
                </div>
              </div>
              <div className="metric">
                <div className="font-bold text-sm md:text-lg">손익({profitViewToDollar ? '$' : '원'})</div>
                <div className="font-bold text-lg md:text-3xl">
                  <CurrencyValue
                    value={profit.gainPriceViewData}
                    isDollar={profitViewToDollar}
                  />
                </div>
              </div>
              <div className="metric">
                <div className="font-bold text-sm md:text-lg">손익(%)</div>
                <div className="font-bold text-lg md:text-3xl">{profit.gainRate.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>        
      </div>

      <div className='flex px-2 pt-2 h-auto bg-[var(--main-bg-color)]'>
        <div className='w-full h-auto'>          

          <div className='series-chart-card mt-3 w-full h-auto'>
            <div className='title flex justify-between'>
              <label>종목비중</label>
              <div className='flex items-center'>
                <label className='me-2 text-base'>달러로 보기</label>
                <ToggleSwitch 
                  enabled={stockPriceViewToDollar}
                  setEnabled={setMyStockViewToDollar}
                  ></ToggleSwitch>
              </div>
            </div>

            <div className='overflow-auto h-auto px-3 mt-4'>
              <div className="w-full">

                {
                  !myStockWeightChartDataOption &&
                  <div className='text-sm w-full h-[100px] flex justify-center items-center'>loading...</div>
                }

                { 
                  myStockWeightChartDataOption && 
                  <div className='w-[100%] h-[600px] md:h-[400px] pb-2'>
                    <EChartsComponent 
                      width={'100%'} height={'100%'} 
                      chartData={myStockWeightChartDataOption} />
                  </div>
                }
                
                <table className="text-sm text-left">
                  <thead>
                    <tr>
                      <th>종목명</th>
                      <th>티커</th>                      
                      <th>매입금액({stockPriceViewToDollar ? '$' : '원'})</th>
                      <th>평가금액({stockPriceViewToDollar ? '$' : '원'})</th>
                      <th>수량</th>
                      <th>비중(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!stockHoldingList && 
                      <tr className='h-[100px]'>
                        <td colSpan={6} className="text-center">loading...</td>
                      </tr>}
                    {stockHoldingList && stockHoldingList.length === 0 &&
                      <tr>
                        <td colSpan={6} className="text-center">보유 종목이 없습니다.</td>
                      </tr>}
                    {stockHoldingList && stockHoldingList.map((d: any, i: number) => (
                        <tr key={i}>
                          <td>
                            <TextInput
                              type="text"
                              value={d.name}
                              onChange={e => updateStockField(i, 'name', e.target.value)}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'name')}
                            />
                          </td>
                          <td>
                            <TextInput
                              type="text"
                              value={d.ticker}
                              onChange={e => updateStockField(i, 'ticker', e.target.value)}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'ticker')}
                            />
                          </td>
                          <td>
                            <MoneyInput
                              value={d.totalPurchasePriceViewData}
                              isDollar={stockPriceViewToDollar}
                              onChange={e => updateStockField(i, 'totalPurchasePriceViewData', e.target.value)}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'totalPurchasePriceViewData')}
                            />                            
                          </td>
                          <td>
                            <MoneyInput
                              value={d.totalValuationPriceViewData}
                              isDollar={stockPriceViewToDollar}
                              onChange={e => updateStockField(i, 'totalValuationPriceViewData', e.target.value)}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'totalValuationPriceViewData')}
                            />                              
                          </td>
                          <td>
                            <TextInput
                              type="text"
                              value={Number(d.quantity).toLocaleString()}
                              onChange={e => updateStockField(i, 'quantity', Number(e.target.value))}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'quantity')}
                            />
                          </td>                          
                          <td>
                            <TextInput
                              type="text"
                              value={Number(d.weight).toFixed(2)}
                              onChange={e => updateStockField(i, 'weight', Number(e.target.value).toFixed(2))}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'weight')}
                            />
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>              
            </div>            
          </div>

          <div className="flex flex-col sm:flex-row w-full px-2 h-[600px] sm:h-[400px] mt-4 mb-4">
            <div className="series-chart-card w-full sm:w-1/2 h-full sm:me-2 mb-4 sm:mb-0">
              <div className="title flex justify-between">
                <label>수익률 변화(%)</label>
              </div>
              <div className="flex w-full h-full">
                {profitTrendChartOption && (
                  <EChartsComponent
                    width={'100%'}
                    height={'90%'}
                    chartData={profitTrendChartOption}
                  />
                )}
              </div>
            </div>
            <div className="series-chart-card w-full sm:w-1/2 h-full sm:ms-2">
              <div className="title flex justify-between">
                <label>월간 수익(원화)</label>
              </div>
              <div className="flex w-full h-full">
                {monthlyProfitTrendChartOption && (
                  <EChartsComponent
                    width={'100%'}
                    height={'90%'}
                    chartData={monthlyProfitTrendChartOption}
                  />
                )}
              </div>
            </div>
          </div>
        </div>        
      </div>      
    </div>    
  );
};

export default Profit;