'use client'
import React, { useState, useEffect } from 'react';
import EChartsComponent from '@/graphs/EChartsComponent';
import { ProfitService } from '@/services/ProfitService';
import { createProfit, ProfitProp, updatePriceViewDataByCurrency } from '@/properties/Profit';
import { updateStockListPriceByCurrency, StockProp } from '@/properties/Stock';
import ToggleSwitch from '@/components/ToggleSwitch';
import styled from 'styled-components';

const TextInput = styled.input`
  cursor: pointer;
  text-align: center;
`

const Profit = () => {
  // const [profitOrigin, setProfitOrigin] = useState<ProfitProp>(createProfit());
  const [profit, setProfit] = useState<ProfitProp>(createProfit());
  const [profitViewToDollar, setProfitViewToDollar] = useState(true);
  const [myStockList, setMyStockList] = useState<StockProp[]>([]);
  const [myStockViewToDollar, setMyStockViewToDollar] = useState(true);
  const [profitTrendChartOption, setProfitTrendChartOption] = useState<any>({});
  const [monthlyProfitTrendChartOption, setMonthlyProfitTrendChartOption] = useState<any>({});
  const [myStockWeightChartDataOption, setMyStockWeightChartDataOption] = useState<any>({});

  const fetchMyStockData = async () => {
    const serv = new ProfitService();                
    const myStockData: StockProp[]  = await serv.getMyStockData(myStockViewToDollar);    
    const myStockWeightChartData: any[] = [];
    myStockData.map((item: StockProp) => {
      const chartData = { name: item.name, value: item.weight }
      myStockWeightChartData.push(chartData);      
      profit.purchaseAmount += item.purchaseAmount;
      profit.purchaseAmount_Won += item.purchaseAmount_Won;
      profit.marketValue += item.valuation;
      profit.marketValue_Won += item.valuation_Won;
    })
    profit.gainPrice = profit.marketValue - profit.purchaseAmount;
    profit.gainPrice_Won = profit.marketValue_Won - profit.purchaseAmount_Won;
    profit.gainRate = (profit.gainPrice / profit.purchaseAmount) * 100;
    setMyStockList(myStockData);    

    updatePriceViewDataByCurrency(profit, true);
    setProfit(profit);

    const _myStockWeightChartDataOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal', // 범례를 수평으로 설정
        bottom: 20,
        left: 'center', // 범례를 중앙에 배치
        data: myStockWeightChartData.map(item => item.name)
      },
      series: [
        {
          // name: '시장 점유율',
          type: 'pie',
          radius: '70%',
          center: ['50%', '35%'],
          data: myStockWeightChartData,
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
  }

  const fetchProfitTrendData = async () => {
    const serv = new ProfitService();   
    const profitTrendData = await serv.getProfitTrendData();
    let xAxis = profitTrendData.map((obj: any) => obj.date);
    let yAxis = profitTrendData.map((obj: any) => obj.rate);        
    let trendChartData = {
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      grid: { top: '10%', bottom: '15%' },
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
      grid: { top: '10%', bottom: '15%' },
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
          yAxisIndex: 0
        }
      ],
    };
    setMonthlyProfitTrendChartOption(trendChartData);
  }

  useEffect(() => {
    fetchMyStockData();
    fetchProfitTrendData();
    fetchMonthlyProfitTrendData();
  }, [])

  useEffect(() => {
    const newProfit = updatePriceViewDataByCurrency({ ...profit }, profitViewToDollar);
    setProfit(newProfit);  // 새로운 객체로 교체
  }, [profitViewToDollar])

  useEffect(() => {


  }, [myStockList])

  useEffect(() => {
    const newStockList = updateStockListPriceByCurrency([ ...myStockList ], myStockViewToDollar);
    setMyStockList(newStockList);  // 새로운 객체로 교체
  }, [myStockViewToDollar])

  const updateStockField = (index: number, field: keyof StockProp, value: any) => {
    setMyStockList(prev =>
      prev.map((item, i) =>
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

            <div className="flex flex-col sm:flex-row justify-between px-6 sm:px-20 mt-4 text-center gap-2">
              <div className="metric">
                <div className="met-title">매입금액({profitViewToDollar ? '$' : '원'})</div>
                <div className="met-value">{profit.purchaseAmountViewData.toLocaleString()}</div>
              </div>
              <div className="metric sm:ml-3">
                <div className="met-title">평가금액({profitViewToDollar ? '$' : '원'})</div>
                <div className="met-value">{profit.marketValueViewData.toLocaleString()}</div>
              </div>
              <div className="metric sm:ml-3">
                <div className="met-title">손익({profitViewToDollar ? '$' : '원'})</div>
                <div className="met-value">{profit.gainPriceViewData.toLocaleString()}</div>
              </div>
              <div className="metric sm:ml-3">
                <div className="met-title">손익(%)</div>
                <div className="met-value">{profit.gainRate.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>        
      </div>

      <div className='flex px-2 pt-2 h-auto bg-[var(--main-bg-color)]'>
        <div className='mt-2 w-full h-auto'>          

          <div className='series-chart-card mt-3 w-full h-auto'>
            <div className='title flex justify-between'>
              <label>종목비중</label>
              <div className='flex items-center'>
                <label className='me-2 text-base'>달러로 보기</label>
                <ToggleSwitch 
                  enabled={myStockViewToDollar}
                  setEnabled={setMyStockViewToDollar}
                  ></ToggleSwitch>
              </div>
            </div>

            <div className='overflow-auto h-auto px-3 mt-4'>
              <div className="w-full">
                <div className='w-[100%] h-[400px] pt-4 pb-2'>
                { 
                  myStockWeightChartDataOption && 
                  <EChartsComponent 
                    width={'100%'} height={'100%'} 
                    chartData={myStockWeightChartDataOption} />
                }
                </div>
                <table className="text-sm text-left">
                  <thead>
                    <tr>
                      <th>종목명</th>
                      <th>티커</th>                      
                      <th>매입금액({myStockViewToDollar ? '$' : '원'})</th>
                      <th>평가금액({myStockViewToDollar ? '$' : '원'})</th>
                      <th>수량</th>
                      <th>비중(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myStockList.map((d: any, i: number) => (
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
                            <TextInput
                              type="text"
                              value={Number(d.purchaseAmountViewData).toLocaleString()}
                              onChange={e => updateStockField(i, 'purchaseAmountViewData', Number(e.target.value))}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'purchaseAmountViewData')}
                            />
                          </td>
                          <td>
                            <TextInput
                              type="text"
                              value={Number(d.valuationViewData).toLocaleString()}
                              onChange={e => updateStockField(i, 'valuationViewData', Number(e.target.value))}
                              onKeyDown={e => handleStockInputKeyDown(e, i, 'valuationViewData')}
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
                              type="number"
                              value={d.weight}
                              onChange={e => updateStockField(i, 'weight', Number(e.target.value))}
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

          <div className="flex flex-col sm:flex-row w-full px-2 h-[600px] sm:h-[400px] mt-4">
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