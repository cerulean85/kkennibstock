'use client'
import React, { useEffect, useState } from 'react';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import DateRangePicker from '@/components/DateRangePicker';
import EChartsComponent from '@/graphs/EChartsComponent';
import MixedLineBarChartComponent3 from '@/graphs/mixedLineBarChart3';

import { GraphPoint } from '@/models/GraphPoint';
import {
  getCurrentShipList,
  getImportantItemList
} from '@/controllers/ShipController';

import { sumByKeyUpToIndex } from '@/lib/utils';
import { cumulativeSum } from '@/lib/utils';


type ItemData = {
  item: string;
  count: number;
};

type DateData = {
  date: string;
  items: ItemData[];
};

const LogisticsShipPage = () => {
  const lt: any = useSelector((state: RootState) => state.appConfig.localeText);

  const alarmTotal = 1200;
  const alarmFin = 1080;
  const alarmRate = alarmTotal / alarmFin;

  
  const [ currentShipList, setCurrentShipList ] = useState<GraphPoint[]>([]);
  const [ currentShipChartData, setCurrentShipChartData ] = useState<any>(null);

  const [ importantItemList, setImportantItemList ] = useState<GraphPoint[]>([]);
  const [ importantItemChartData, setImportantItemChartData ] = useState<any>(null);
  
  function getItemCounts(data: DateData[]): { [item: string]: number[] } {
    const result: { [item: string]: number[] } = {};
  
    data.forEach((entry) => {
      entry.items.forEach((item) => {
        if (!result[item.item]) {
          result[item.item] = [];
        }
        result[item.item].push(item.count);
      });
    });

    return result;
  }

  useEffect(() => {

      (
        async function () {
          const data: GraphPoint[] = await getCurrentShipList();
          setCurrentShipList(data);

          const xValues = data.map(obj => obj.x);
          const yValues = data.map(obj => obj.y);
          const yCumValues = cumulativeSum(yValues);

          const chartData = {
            tooltip: { trigger: 'axis', },
            legend: {
              data: ['출고량', '누적출고량'],
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
                name: '출고량', type: 'bar',
                data: yValues,
                emphasis: { focus: 'series' },
                yAxisIndex: 0
              },
              {
                name: '누적출고량', type: 'line',
                data: yCumValues,
                emphasis: { focus: 'series' },
                yAxisIndex: 1
              }
            ]
          };

          setCurrentShipChartData(chartData);

          const data2: any[] = await getImportantItemList();
          setImportantItemList(data2);
          
          const rrr = getItemCounts(data2);
          console.log("rrr")
          console.log("rrr")
          const itemKeys = Object.keys(rrr);
          console.log(rrr)
          console.log(itemKeys)
          const dates = data2.map(obj => obj.date);
          console.log(dates)
          // setImportantItemList(data);

          // {
          //   name: '처리',
          //   type: 'line',
          //   data: [13, 36, 67, 12, 99],
          //   emphasis: {
          //     focus: 'series',
          //   },
          // },
          const seriesArr: any[] = [];
          for ( const key of itemKeys) {
            const series = {
              name: key, type: 'line',
              emphasis: { focus: 'series' },
              data: rrr[key]
            }
            seriesArr.push(series);
            // console.log(series);
          }

          console.log("seriesArr")
          console.log(seriesArr)
          console.log(seriesArr)

          const options = {
            tooltip: {
              trigger: 'axis',
            },
            legend: {
              data: itemKeys,
              orient: 'vertical',
              right: 0,  // 범례를 아래쪽에 배치
              top: 'center'
              // type: 'scroll',  // 범례가 많으면 스크롤 가능하게 설정
            },
            xAxis: {
              type: 'category',
              data: dates,
            },
            yAxis: [
              {
                type: 'value',
              }
            ],
            series: seriesArr,
          };

          setImportantItemChartData(options);
        }
      )();

  }, [])

  return (
    <div className='pb-3'>
      <div className='series-chart-card'>
        <div className='title d-flex justify-content-between'>
          <label>출고량 현황</label>
          <DateRangePicker></DateRangePicker>
        </div>

        <div className='d-flex h-100'>
          <div className='w-50'>
            <div className='d-flex align-items-center justify-content-evenly px-5 mt-4 '>
              <div className='metric'>
                <div className='met-title'>출고량(최근)</div>
                <div className='met-value'>{alarmTotal.toLocaleString()}</div>
              </div>
              <div className='metric'>
                <div className='met-title'>누적 출고량</div>
                <div className='met-value'>{alarmFin.toLocaleString()}</div>
              </div>
            </div>
            <div className='d-flex justify-content-between'>

              {currentShipChartData && <EChartsComponent chartData={currentShipChartData} /> }
            </div>               
          </div>
          <div className='ship-trend-table'>
          <table className="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th>기간</th>
                  <th>출고량</th>
                  <th>누적출고량</th>
                </tr>
              </thead>
              <tbody>
              {currentShipList.map((d: any, i: any) => (
                  <tr key={i}>
                    <td>{d.x}</td>
                    <td>{d.y}</td>
                    <td>{sumByKeyUpToIndex(currentShipList, 'y', i)}</td>
                  </tr>
                ))}
              </tbody>
            </table>            
          </div>
        </div>
      </div>

      <div className='al-cur-equip-series-card mt-3'>

        <div className='title d-flex justify-content-between'>
            <label>중점 출고 규격</label>
            <DateRangePicker></DateRangePicker>
          </div>

        <div className='chart'>
          {importantItemChartData && <MixedLineBarChartComponent3 chartData={importantItemChartData} /> }

          <div className='ship-imp-table'>
            {
              importantItemList.map((d: any, i: any) => (
                <div className='ship-imp-table-column'>
                  <div className='ship-imp-table-row'>
                    <div className='ship-imp-table-date-cell'>{d.date}</div>
                  </div>
                  <div className='ship-imp-table-row'>
                    <div className='ship-imp-table-left-head'>품목</div>
                    <div className='ship-imp-table-right-head'>출고</div>
                  </div>

                  {d.items.map((sub: any, j: any) => (
                  <div className='ship-imp-table-row'>
                    <div className='ship-imp-table-left-cell'>{sub.item}</div>
                    <div className='ship-imp-table-right-cell'>{sub.count}</div>
                  </div>
                  ))}
                </div>    
              ))
            }

          </div>
        </div>          
      </div>

    </div>
  );
};
export default LogisticsShipPage;