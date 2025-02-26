import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const StackedBarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // 차트를 그릴 div를 가져옴
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.showLoading({
      text: '로딩 중...',  // 로딩 텍스트
      effect: 'spin',     // spin 스타일의 로딩 애니메이션
      textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
      },
    });
    chartInstance.showLoading();
    // 차트 옵션 설정
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['처리', '완료'],
        orient: 'vertical',  // 세로 방향으로 배치
        right: 10,           // 우측에 배치
        top: 'middle',       // 중간에 위치
      },
      xAxis: {
        type: 'category',
        data: ['S/C #1', 'S/C #2', 'S/C #3', 'S/C #4', 'S/C #5'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '처리',
          type: 'bar',
          stack: 'stack1',  // 누적 차트로 설정
          emphasis: {
            focus: 'series',
          },
          data: [10, 20, 30, 40, 50],
        },
        {
          name: '완료',
          type: 'bar',
          stack: 'stack1',  // 누적 차트로 설정
          emphasis: {
            focus: 'series',
          },
          data: [20, 30, 40, 50, 60],
        },
      ],
    };

    // 차트에 옵션을 설정
    chartInstance.setOption(options);
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
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default StackedBarChart;
