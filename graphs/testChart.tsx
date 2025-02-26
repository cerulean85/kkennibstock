"use client"; // Next.js 13 이상에서는 "use client" 선언 필요

import React, { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

const EChartsComponent = () => {
  const chartRef = useRef<any>(null);

  // 그래프 옵션
  const options = {
    // title: { text: "반응형 차트" },
    tooltip: {},
    xAxis: { type: "category", data: ["A", "B", "C", "D", "E"] },
    yAxis: { type: "value" },
    series: [{ data: [10, 22, 28, 43, 49], type: "bar" }],
  };

  // ✅ 윈도우 크기 변경 시 차트 리사이징
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <ReactECharts ref={chartRef} option={options} style={{ width: "100%", height: "360px" }} />
    </div>
  );
};

export default EChartsComponent;
