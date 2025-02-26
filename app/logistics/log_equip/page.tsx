'use client'
import React, { useState, useEffect } from 'react';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import DateRangePicker from '@/components/DateRangePicker';
import EChartsComponent from '@/graphs/EChartsComponent';
import {
  getStackerCraneSaveList,
  getGantrySaveList
} from '@/controllers/ShipController';

const LogisticsEquipStoragePage = () => {


  const lt: any = useSelector((state: RootState) => state.appConfig.localeText);

  const alarmTotal = 1200;
  const alarmFin = 1080;
  const alarmRate = alarmTotal / alarmFin;

    const [ scSaveList, setScSaveList ] = useState<any[]>([]);
    const [ scChartData, setScChartData ] = useState<any>(null);

    const [ gantSaveList, setGantSaveList ] = useState<any[]>([]);
    const [ gantChartData, setGantChartData ] = useState<any>(null);


    useEffect(() => {

      (
        async function () {
          const data: any[] = await getStackerCraneSaveList();
          setScSaveList(data);

          const xValues = data.map(obj => obj.type);
          const currentValues = data.map(obj => obj.currentCount);
          const maxValues = data.map(obj => obj.maxCount);

          const chartData = {
            tooltip: { trigger: 'axis', },
            legend: {
              data: ['적치', '적치가능'],
              bottom: 0,
            },
            xAxis: { type: 'category', data: xValues },
            yAxis: [ 
              { 
                type: 'value',
                position: 'left',
                min: 0,
                max: Math.max(...currentValues)
              },
              {
                type: 'value',
                position: 'right',
                min: 0,
                max: Math.max(...maxValues)
              }
            ],
            series: [
              {
                name: '적치', type: 'bar',
                data: currentValues,
                emphasis: { focus: 'series' },
                yAxisIndex: 0
              },
              {
                name: '적치가능', type: 'bar',
                data: maxValues,
                emphasis: { focus: 'series' },
                yAxisIndex: 1
              }
            ]
          };

          setScChartData(chartData);          
        }
      )();

      (
        async function () {
          const data: any[] = await getGantrySaveList();
          setGantSaveList(data);

          const xValues = data.map(obj => obj.type);
          const currentValues = data.map(obj => obj.currentCount);
          const maxValues = data.map(obj => obj.maxCount);

          const chartData = {
            tooltip: { trigger: 'axis', },
            legend: {
              data: ['적치', '적치가능'],
              bottom: 0,
            },
            xAxis: { type: 'category', data: xValues },
            yAxis: [ 
              { 
                type: 'value',
                position: 'left',
                min: 0,
                max: Math.max(...currentValues)
              },
              {
                type: 'value',
                position: 'right',
                min: 0,
                max: Math.max(...maxValues)
              }
            ],
            series: [
              {
                name: '적치', type: 'bar',
                data: currentValues,
                emphasis: { focus: 'series' },
                yAxisIndex: 0
              },
              {
                name: '적치가능', type: 'bar',
                data: maxValues,
                emphasis: { focus: 'series' },
                yAxisIndex: 1
              }
            ]
          };

          setGantChartData(chartData);          
        }
      )();

  }, [])

  return (
    <div className='pb-3'>

      <div className='series-chart-card' style={{ height: '900px'}}>

        <div className='title d-flex justify-content-between'>
            <label>Stacker Crane별 적치 현황</label>
            <DateRangePicker></DateRangePicker>
          </div>

        <div className='chart'>
          { scChartData && <EChartsComponent chartData={scChartData} /> }

          <div className='d-flex'>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>설비</th>
                  <th>적치가능</th>
                  <th>적치</th>
                  <th>미적치</th>
                  <th>안전재고</th>
                  <th>적치율</th>
                  <th>품목수</th>
                </tr>
              </thead>
              <tbody>
              {scSaveList.map((d: any, i: any) => (
                  <tr key={i}>
                    <td>{d.type}</td>
                    <td>{d.maxCount}</td>
                    <td>{d.currentCount}</td>
                    <td>{d.maxCount - d.currentCount}</td>
                    <td>{d.safetyCount}</td>
                    <td>{(d.currentCount / d.maxCount ) * 100}%</td>
                    <td>{d.items.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>            
          </div>
        </div>          
      </div>

      <div className='series-chart-card mt-3' style={{ height: '900px'}}>

        <div className='title d-flex justify-content-between'>
            <label>Gantry별 적치 현황</label>
            <DateRangePicker></DateRangePicker>
          </div>

        <div className='chart'>
        { gantChartData && <EChartsComponent chartData={gantChartData} /> }

          <div className='d-flex'>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>설비</th>
                  <th>적치가능</th>
                  <th>적치</th>
                  <th>미적치</th>
                  <th>안전재고</th>
                  <th>적치율</th>
                  <th>품목수</th>
                </tr>
              </thead>
              <tbody>
              {gantSaveList.map((d: any, i: any) => (
                  <tr key={i}>
                    <td>{d.type}</td>
                    <td>{d.maxCount}</td>
                    <td>{d.currentCount}</td>
                    <td>{d.maxCount - d.currentCount}</td>
                    <td>{d.safetyCount}</td>
                    <td>{((d.currentCount / d.maxCount ) * 100).toFixed(2)}%</td>
                    <td>{d.items.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>            
          </div>
        </div>          
      </div>


    </div>
  );
};

export default LogisticsEquipStoragePage;