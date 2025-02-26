import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsComponent = ({ chartData } : { chartData: any }) => {

  const chartRef = useRef(null);
  
  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.showLoading({
      text: 'Loading...', effect: 'spin',
      textStyle: { fontSize: 20, fontWeight: 'bold', },
    });
  
    chartInstance.showLoading();

    chartInstance.setOption(chartData);
    chartInstance.hideLoading();

    // 반응형 처리: 윈도우 크기가 변경되면 차트 리사이즈
    window.addEventListener('resize', () => {
      chartInstance.resize();
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', () => {
        chartInstance.resize();
      });
      chartInstance.dispose();
    };
  }, [])

  // useEffect(() => {

    // const xValues = data.map(obj => obj.x);
    // const yValues = data.map(obj => obj.y);
    
    // const options = {
    //   tooltip: { trigger: 'axis', },
    //   legend: {
    //     data: ['출고량', '누적출고량'],
    //     bottom: 0,  // 범례를 아래쪽에 배치
    //     type: 'scroll',  // 범례가 많으면 스크롤 가능하게 설정
    //   },
    //   xAxis: { type: 'category', data: xValues },
    //   yAxis: [ { type: 'value' } ],
    //   series: [
    //     {
    //       name: '출고량', type: 'bar',
    //       data: yValues,
    //       emphasis: { focus: 'series' },
    //     },
    //   ],
    // };

    // setTimeout(() => {
    //   if (chartInstance == undefined)
    //     return;


    // }, 500);
    


  // }, [currentShipList])

  

  // useEffect(() => {


    
  //   setTimeout(() => {
  //     (
  //       async function () {
  //         // alert(data.length)
  //         // const data: GraphPoint[] = await getData();
  //         const xValues = data.map(obj => obj.x);
  //         const yValues = data.map(obj => obj.y);
          
  //         const options = {
  //           tooltip: { trigger: 'axis', },
  //           legend: {
  //             data: ['출고량', '누적출고량'],
  //             bottom: 0,  // 범례를 아래쪽에 배치
  //             type: 'scroll',  // 범례가 많으면 스크롤 가능하게 설정
  //           },
  //           xAxis: { type: 'category', data: xValues },
  //           yAxis: [ { type: 'value' } ],
  //           series: [
  //             {
  //               name: '출고량', type: 'bar',
  //               data: yValues,
  //               emphasis: { focus: 'series' },
  //             },
  //           ],
  //         };

  //         chartInstance.setOption(options);
  //         chartInstance.hideLoading();
  //       }
  //     )();
  //   }, 5000);



  // }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default EChartsComponent;
