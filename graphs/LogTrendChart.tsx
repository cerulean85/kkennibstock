import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LogTrendChart = () => {
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
      },
      legend: {
        data: ['적치량', '누적'],
        bottom: 0,  // 범례를 아래쪽에 배치
        type: 'scroll',  // 범례가 많으면 스크롤 가능하게 설정
      },
      xAxis: {
        type: 'category',
        data: ['12주전', '11주전', '10주전', '9주전', '8주전', '7주전', '6주전', '5주전'],
      },
      yAxis: [
        {
          type: 'value',
        },
        {
          type: 'value',  // 오른쪽 Y 축
          position: 'right',  // 오른쪽에 배치
          min: 0,
          max: 24,
        },
      ],
      series: [
        {
          name: '적치량',
          type: 'bar',
          data: [10, 20, 30, 40, 50, 60, 70, 80],
          emphasis: {
            focus: 'series',
          },
        },
        {
          name: '누적',
          type: 'line',
          data: [10, 30, 60, 100, 150, 210, 280, 360],
          emphasis: {
            focus: 'series',
          },
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

export default LogTrendChart;
