import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const MixedChart =  ({ chartData } : { chartData: any }) => {
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

  return <div ref={chartRef} style={{ width: '95%', height: '400px' }}></div>;
};

export default MixedChart;
