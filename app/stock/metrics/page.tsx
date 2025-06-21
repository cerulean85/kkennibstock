'use client'
import React, { useState, useEffect } from 'react';
import EChartsComponent from '@/graphs/EChartsComponent';
import { MetricsService } from '@/services/MetricsService';
import { UseDispatch } from '@/stores/store';
import { setAllPageLoading } from '@/stores/appConfigSlice';
import { useLocale } from '@/layouts/LocaleContext';

const MetricsPage = () => {  
  const [ vixDataOption, setVixDataOption ] = useState<any>(null);
  const [ vxnDataOption, setVxnDataOption ] = useState<any>(null);
  const [ sp500DataOption, setSp500DataOption ] = useState<any>(null);
  const [ ndxDataOption, setNdxDataOption ] = useState<any>(null);
  const [ usdkrDataOption, setUsdkrDataOption ] = useState<any>(null);
  const [ goldDataOption, setGoldDataOption ] = useState<any>(null);
  const [ oilDataOption, setOilDataOption ] = useState<any>(null);
  const [ us10yDataOption, setUs10yDataOption ] = useState<any>(null);

  const [ lastVixValue, setLastVixValue ] = useState(0);
  const [ lastVxnValue, setLastVxnValue ] = useState(0);
  const [ lastSp500Value, setLastSp500Value ] = useState(0);
  const [ lastNdxValue, setLastNdxValue ] = useState(0);
  const [ lastUsdkrValue, setLastUsdkrValue ] = useState(0);
  const [ lastGoldValue, setLastGoldValue ] = useState(0);
  const [ lastOilValue, setLastOilValue ] = useState(0);
  const [ lastUs10yValue, setLastUs10yValue ] = useState(0);

  const fetchMetricsData = async () => {
    const serv = new MetricsService();
    const tickersPeriods = {
      "tickers_periods": {
        "^VIX": "3mo",
        "^VXN": "3mo",
        "^GSPC": "1mo",
        "^NDX": "1mo",
        "USDKRW=X": "1mo",
        "GC=F": "1mo",
        "CL=F": "1mo",
        "^TNX": "1mo"
      }
    }
    const data: any = await serv.getMetricsData(tickersPeriods);
    fetchVixData(data["^VIX"]);
    fetchVxnData(data["^VXN"]);
    fetchSp500Data(data["^GSPC"]);
    fetchNdxData(data["^NDX"]);
    fetctUsdkrData(data["USDKRW=X"]);
    fetchGoldData(data["GC=F"]);
    fetchOilData(data["CL=F"]);
    fetchUs10yData(data["^TNX"]);
  }
  const fetchVixData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: 'VIX', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#FF6B6B' }
        }
      ]
    };
    setVixDataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastVixValue(lastValue.value);
  };

  const fetchVxnData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: 'VXN', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#6BCB77' }
        }
      ]
    };
    setVxnDataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastVxnValue(lastValue.value);
  };

  const fetchSp500Data = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: 'S&P500', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#4D96FF' }
        }
      ]
    };
    setSp500DataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastSp500Value(lastValue.value);
  };

  const fetchNdxData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: 'Nasdaq100', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#FFD93D' }
        }
      ]
    };
    setNdxDataOption(chartData);
    
    const lastValue = data[data.length - 1]
    setLastNdxValue(lastValue.value);
  };

  const fetctUsdkrData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: '원달러', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#845EC2' }
        }
      ]
    };
    setUsdkrDataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastUsdkrValue(lastValue.value);    
  };

  const fetchGoldData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: 'Gold', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#00C9A7' }
        }
      ]
    };
    setGoldDataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastGoldValue(lastValue.value);    
  };

  const fetchOilData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: 'WTI원유', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#FF9671' }
        }
      ]
    };
    setOilDataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastOilValue(lastValue.value);        
  };

  const fetchUs10yData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: 'axis', },
      grid: {
        top: 20,       // 그래프 위쪽 여백
        bottom: 40,    // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25
      },
      xAxis: { type: 'category', data: xValues },
      yAxis: [ 
        { 
          type: 'value',
          position: 'left',
          min: 0,
          max: Math.ceil(Math.max(...yValues))
        }
      ],
      series: [
        {
          name: '미국채10년물', type: 'line',
          data: yValues,
          emphasis: { focus: 'series' },
          yAxisIndex: 0,
          itemStyle: { color: '#2C73D2' }
        }
      ]
    };
    setUs10yDataOption(chartData);

    const lastValue = data[data.length - 1]
    setLastUs10yValue(lastValue.value);        
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-3">
          <div className="series-chart-card w-full h-full items-center bg-white rounded-lg shadow-lg">
            <div className="title w-full h-[40px] flex justify-between items-center border-b border-b-[var(--black-night)]">
              <strong>VIX</strong>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastVixValue}</div>
              </div>                
            </div>            
            <div className="w-full h-[280px] pt-2">
              <EChartsComponent chartData={vixDataOption} width={'100%'} height={'100%'} />
            </div>
            <div className="w-full min-w-[180px] h-auto top-3 overflow-auto break-words">

              <div className="w-full h-[calc(100%-60px)] whitespace-pre-wrap break-words overflow-x-auto">
                <ul className="list-disc list-inside text-sm">
                  <li>S&P500 지수 옵션의 변동성을 기반으로 만든 공포 지수</li>
                  <li>향후 30일간의 S&P500의 변동성에 대한 예상을 수치화</li>
                  <li>CBOE에서 계산 및 발표, 투자자 심리를 파악하는 데 많이 사용됨</li>
                  <li><strong>0~15</strong>	안정/낙관, 위험 선호</li>
                  <li><strong>15~20</strong> 보통 수준의 변동성</li>
                  <li><strong>20~30</strong> 다소 불안정</li>
                  <li><strong>30~40</strong> 고변동성/불안확대</li>
                  <li><strong>40이상</strong>	공포극심</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-3">
          <div className="series-chart-card w-full h-full items-center bg-white rounded-lg shadow-lg">
            <div className="title w-full h-[40px] flex justify-between items-center border-b border-b-[var(--black-night)]">
              <strong>VXN</strong>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastVxnValue}</div>
              </div>
            </div>
            <div className="w-full h-[280px] pt-2">
              <EChartsComponent chartData={vxnDataOption} width={'100%'} height={'100%'} />
            </div>
            <div className="w-full min-w-[180px] h-auto top-3 overflow-auto break-words">
              
              <div className="w-full h-[calc(100%-60px)] whitespace-pre-wrap break-words overflow-x-auto">
                <ul className="list-disc list-inside text-sm">          
                  <li>NASDAQ-100 지수 옵션의 변동성을 반영한 지수</li>
                  <li>NASDAQ-100에 대한 투자자들의 불안 심리와 기대 변동성 측정</li>
                  <li>CBOE에서 계산/발표, 투자자 심리를 파악하는 데 많이 사용됨</li>
                  <li><strong>0~15</strong>	안정/기술주 낙관</li>
                  <li><strong>15~25</strong> 보통 수준의 변동성</li>
                  <li><strong>25~35</strong> 기술주 조정 우려</li>
                  <li><strong>35이상</strong>	공포극심/매도세심화</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-[300px] p-3">
          <div className='series-chart-card w-full h-full'>
            <div className="title flex justify-between">
              <label>S&P 500</label>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastSp500Value}</div>
              </div>
            </div>
            <div className="w-full h-[90%]">
              <EChartsComponent chartData={sp500DataOption} width={'100%'} height={'100%'} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-[300px] p-3">
          <div className='series-chart-card w-full h-full'>
            <div className="title flex justify-between">
              <label>Nasdaq 100</label>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastNdxValue}</div>
              </div>
            </div>
            <div className="w-full h-[90%]">
              <EChartsComponent chartData={ndxDataOption} width={'100%'} height={'100%'} />
            </div>
          </div>
        </div>      
        <div className="w-full md:w-1/3 h-[300px] p-3">
          <div className='series-chart-card w-full h-full'>
            <div className="title flex justify-between">
              <label>달러환율</label>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastUsdkrValue}</div>
              </div>
            </div>
            <div className="w-full h-[90%]">
              <EChartsComponent chartData={usdkrDataOption} width={'100%'} height={'100%'} />
            </div>
          </div>
        </div>
      </div>    
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-[300px] p-3">
          <div className='series-chart-card w-full h-full'>
            <div className="title flex justify-between">
              <label>Gold</label>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastGoldValue}</div>
              </div>              
            </div>
            <div className="w-full h-[90%]">
              <EChartsComponent chartData={goldDataOption} width={'100%'} height={'100%'} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-[300px] p-3">
          <div className='series-chart-card w-full h-full'>
            <div className="title flex justify-between">
              <label>미국채 10년물</label>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastUs10yValue}</div>
              </div>              
            </div>
            <div className="w-full h-[90%]">
              <EChartsComponent chartData={us10yDataOption} width={'100%'} height={'100%'} />
            </div>
          </div>
        </div>      
        <div className="w-full md:w-1/3 h-[300px] p-3">
          <div className='series-chart-card w-full h-full'>
            <div className="title flex justify-between">
              <label>WTI Oil</label>
              <div className='flex items-center font-normal text-sm'>
                Today&nbsp;
                <div className='text-gray-800 font-bold text-lg'>{lastOilValue}</div>
              </div>
            </div>
            <div className="w-full h-[90%]">
              <EChartsComponent chartData={oilDataOption} width={'100%'} height={'100%'} />
            </div>
          </div>
        </div>
      </div>          
    </div>
  );
};

export default MetricsPage;