"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";

const EChartsComponent = ({ chartData, width = "100%", height = 400 }: { chartData: any; width: any; height: any }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.showLoading({
      text: "loading...",
      effect: "spin",
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
      },
      color: "#0D6EFD",
      backgroundColor: "transparent", // 배경을 투명하게 설정
    });

    setTimeout(() => {
      chartInstance.setOption(chartData);
      chartInstance.hideLoading();
    }, 1000);

    // 반응형 처리: 윈도우 크기가 변경되면 차트 리사이즈
    window.addEventListener("resize", () => {
      chartInstance.resize();
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", () => {
        chartInstance.resize();
      });
      chartInstance.dispose();
    };
  }, [chartData]);

  return <div ref={chartRef} style={{ width: width, height: height }}></div>;
};

export default EChartsComponent;
