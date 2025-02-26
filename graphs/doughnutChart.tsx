"use client";

import React from "react";
import ReactECharts from "echarts-for-react";

const DoughnutChart = ({ value }: { value: number }) => {
  const options = {
    title: {
      text: `${value}%`,  // 중앙 텍스트를 동적으로 변경
      left: "50%",
      top: "50%",
      textAlign: "center",
      textVerticalAlign: "middle",
      textStyle: { fontSize: 24, fontWeight: "bold", color: "#333" },
    },
    series: [
      {
        type: "pie",
        radius: ["50%", "80%"],
        center: ["50%", "50%"],
        data: [
          { value, name: "사용량" },
          { value: 100 - value, name: "남은 용량", itemStyle: { color: "#ddd" } },
        ],
        label: { show: false },
      },
    ],
  };

  return <ReactECharts option={options} style={{ width: "100%", height: "90%" }} />;
};

export default DoughnutChart;
