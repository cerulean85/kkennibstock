"use client";
import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

const MixedLineBarChartComponent2 = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    // 차트 인스턴스 생성
    const myChart = echarts.init(chartRef.current);

    // 차트 옵션 설정
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
      },
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ["line", "bar"] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        data: ["Evaporation", "Precipitation", "Temperature"],
        bottom: 0,
      },
      xAxis: [
        {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "Precipitation",
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: "{value} ml",
          },
        },
        {
          type: "value",
          name: "Temperature",
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: "{value} °C",
          },
        },
      ],
      series: [
        {
          name: "Evaporation",
          type: "bar",
          tooltip: {
            valueFormatter: function (value: string) {
              return value + " ml";
            },
          },
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        },
        {
          name: "Precipitation",
          type: "bar",
          tooltip: {
            valueFormatter: function (value: string) {
              return value + " ml";
            },
          },
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        },
        {
          name: "Temperature",
          type: "line",
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: function (value: string) {
              return value + " °C";
            },
          },
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
        },
      ],
    };
    // 차트 적용
    myChart.setOption(option);

    // 컴포넌트 언마운트 시 차트 리소스 해제
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} className="al-status-mixed-graph" />;
};

export default MixedLineBarChartComponent2;
