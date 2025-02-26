'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import DateRangePicker from '@/components/DateRangePicker';
import EChartsComponent from '@/graphs/EChartsComponent';

import { GraphPoint } from '@/models/GraphPoint';
import {
  getSaveTrendList
} from '@/controllers/ShipController';
import { cumulativeSum } from '@/lib/utils';

const LogisticsBasicStoragePage = () => {
  const lt: any = useSelector((state: RootState) => state.appConfig.localeText);

  const maxSave = 18000;
  const currentSave = 9000;

  let palletData: any = [
    { id: 1, type: "5개 이하", count: 100, stackCount: 453, average: 4.5 },
    { id: 2, type: "6개 ~ 10개", count: 200, stackCount: 1912, average: 9.5 },
    { id: 3, type: "11개 ~ 15개", count: 200, stackCount: 2800, average: 14.0 },
    { id: 4, type: "16개 이상", count: 250, stackCount: 4320, average: 17.2 },    
  ];

  const palletTotal = 750;
  const palletStackTotal = 750;
  const palletAver = 12.6;

  let itemData: any = [
    { id: 1, type: "3개월 미만", items: ["A123", "A124", "A125"], count: 453 },
    { id: 2, type: "3개월 이상", items: ["A123", "A124", "A125"], count: 1912 },
    { id: 3, type: "6개월 이상", items: ["A123", "A124", "A125"], count: 2800 },
    { id: 4, type: "1년 이상", items: ["A123", "A124", "A125"], count: 4320 },    
  ];

  let itemTotal = 10000;
  const [ trendChartData, setTrendChartData ] = useState<any>(null);
  useEffect(() => {  
    (
      async function () {
        const data: GraphPoint[] = await getSaveTrendList();

        const xValues = data.map(obj => obj.x);
        const yValues = data.map(obj => obj.y);
        const yCumValues = cumulativeSum(yValues);

        const chartData = {
          tooltip: { trigger: 'axis', },
          legend: {
            data: ['적치량', '누적적치량'],
            bottom: 0,
          },
          xAxis: { type: 'category', data: xValues },
          yAxis: [ 
            { 
              type: 'value',
              position: 'left',
              min: 0,
              max: Math.max(...yValues)
            },
            {
              type: 'value',
              position: 'right',
              min: 0,
              max: Math.max(...yCumValues)
            }
          ],
          series: [
            {
              name: '적치량', type: 'bar',
              data: yValues,
              emphasis: { focus: 'series' },
              yAxisIndex: 0
            },
            {
              name: '누적적치량', type: 'line',
              data: yCumValues,
              emphasis: { focus: 'series' },
              yAxisIndex: 1
            }
          ]
        };

        setTrendChartData(chartData);

      }
    )();  
  }, []);

  return (
    <div>
      <div className='series-chart-card' style={{height: '200px'}}>
        <div className='title d-flex justify-content-between'>
          <label>{lt.component.auto_storage_board}</label>
          {/* <DateRangePicker></DateRangePicker> */}
        </div>

        <div className='d-flex justify-content-between px-5 mt-4'>
          <div className='metric'>
            <div className='met-title'>적재최대치</div>
            <div className='met-value'>{maxSave.toLocaleString()}</div>
          </div>
          <div className='metric ms-3'>
            <div className='met-title'>실시간적재량</div>
            <div className='met-value'>{currentSave.toLocaleString()}</div>
          </div>
          <div className='metric ms-3'>
            <div className='met-title'>적재율</div>
            <div className='met-value'>{((currentSave / maxSave) * 100).toFixed(2)}%</div>
          </div>
        </div>
      </div>

      <div className='series-chart-card mt-3' style={{ height: '500px' }}>
      <div className='title d-flex justify-content-between'>
        <label>{lt.component.storage_graph}</label>
        <DateRangePicker></DateRangePicker>
      </div>

        <div className='chart'>
          {trendChartData && <EChartsComponent chartData={trendChartData} /> }
        </div>               
      </div>  


      <div className='series-chart-card mt-3' style={{height: '355px'}}>
        <div className='title d-flex justify-content-between'>
          <label>{lt.component.pallet_storage_board}</label>
        </div>

        <div className='chart'>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>구분</th>
                <th>수량</th>
                <th>적재수량</th>
                <th>평균</th>
              </tr>
            </thead>
            <tbody>
            {palletData.map((d: any, i: any) => (
                <tr key={i}>
                  <td>{d.type}</td>
                  <td>{d.count}</td>
                  <td>{d.stackCount}</td>
                  <td>{d.average}</td>
                </tr>
              ))}

              <tr>
                <td>Total</td>
                <td>{palletTotal}</td>
                <td>{palletStackTotal}</td>
                <td>{palletAver}</td>
              </tr>
            </tbody>
          </table>            
        </div>          
      </div>

      <div className='series-chart-card mt-3' style={{height: '310px'}}>
        <div className='title d-flex justify-content-between'>
          <label>{lt.component.long_product_storage_board}</label>
        </div>

        <div className='chart'>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>구분</th>
                <th>수량</th>
                <th>적재수량</th>
                <th>평균</th>
              </tr>
            </thead>
            <tbody>
            {itemData.map((d: any, i: any) => (
                <tr key={i}>
                  <td>{d.type}</td>
                  <td>{d.items[0]}{d.items.length === 1 ? '' : ` 외 ${d.items.length - 1}건`}</td>
                  <td>{d.count}</td>
                  <td>{((d.count / itemTotal) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>            
        </div>          
      </div>
    </div> 
  );
};

export default LogisticsBasicStoragePage;