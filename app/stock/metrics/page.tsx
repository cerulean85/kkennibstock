"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Loading from "@/components/Loading";
import EChartsComponent from "@/graphs/EChartsComponent";
import { MetricsService } from "@/services/MetricsService";
import { UseDispatch } from "@/stores/store";
import { setAllPageLoading } from "@/stores/appConfigSlice";
import { useLocale } from "@/layouts/LocaleContext";

const MetricsPage = () => {
  const [loading, setLoading] = useState(false);
  const [vixDataOption, setVixDataOption] = useState<any>(null);
  const [vxnDataOption, setVxnDataOption] = useState<any>(null);
  const [sp500DataOption, setSp500DataOption] = useState<any>(null);
  const [ndxDataOption, setNdxDataOption] = useState<any>(null);
  const [usdkrDataOption, setUsdkrDataOption] = useState<any>(null);
  const [goldDataOption, setGoldDataOption] = useState<any>(null);
  const [oilDataOption, setOilDataOption] = useState<any>(null);
  const [us10yDataOption, setUs10yDataOption] = useState<any>(null);

  const [lastVixValue, setLastVixValue] = useState(0);
  const [lastVxnValue, setLastVxnValue] = useState(0);
  const [lastSp500Value, setLastSp500Value] = useState(0);
  const [lastNdxValue, setLastNdxValue] = useState(0);
  const [lastUsdkrValue, setLastUsdkrValue] = useState(0);
  const [lastGoldValue, setLastGoldValue] = useState(0);
  const [lastOilValue, setLastOilValue] = useState(0);
  const [lastUs10yValue, setLastUs10yValue] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchMetricsData();
    } catch (error) {
      console.error("Error fetching metrics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetricsData = async () => {
    const serv = new MetricsService();
    const tickersPeriods = {
      tickers_periods: {
        "^VIX": "3mo",
        "^VXN": "3mo",
        "^GSPC": "1mo",
        "^NDX": "1mo",
        "USDKRW=X": "1mo",
        "GC=F": "1mo",
        "CL=F": "1mo",
        "^TNX": "1mo",
      },
    };
    const data: any = await serv.getMetricsData(tickersPeriods);
    fetchVixData(data["^VIX"]);
    fetchVxnData(data["^VXN"]);
    fetchSp500Data(data["^GSPC"]);
    fetchNdxData(data["^NDX"]);
    fetctUsdkrData(data["USDKRW=X"]);
    fetchGoldData(data["GC=F"]);
    fetchOilData(data["CL=F"]);
    fetchUs10yData(data["^TNX"]);
  };
  const fetchVixData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "VIX",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#FF6B6B" },
        },
      ],
    };
    setVixDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastVixValue(lastValue.value);
  };

  const fetchVxnData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "VXN",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#6BCB77" },
        },
      ],
    };
    setVxnDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastVxnValue(lastValue.value);
  };

  const fetchSp500Data = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "S&P500",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#4D96FF" },
        },
      ],
    };
    setSp500DataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastSp500Value(lastValue.value);
  };

  const fetchNdxData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "Nasdaq100",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#FFD93D" },
        },
      ],
    };
    setNdxDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastNdxValue(lastValue.value);
  };

  const fetctUsdkrData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "원달러",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#845EC2" },
        },
      ],
    };
    setUsdkrDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastUsdkrValue(lastValue.value);
  };

  const fetchGoldData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "Gold",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#00C9A7" },
        },
      ],
    };
    setGoldDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastGoldValue(lastValue.value);
  };

  const fetchOilData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "WTI원유",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#FF9671" },
        },
      ],
    };
    setOilDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastOilValue(lastValue.value);
  };
  const fetchUs10yData = (data: any[]) => {
    const xValues = data.map(obj => obj.date);
    const yValues = data.map(obj => obj.value);
    const chartData = {
      tooltip: { trigger: "axis" },
      grid: {
        top: 20, // 그래프 위쪽 여백
        bottom: 40, // 범례를 고려해 조금 더 공간 줌
        left: 50,
        right: 25,
      },
      xAxis: { type: "category", data: xValues },
      yAxis: [
        {
          type: "value",
          position: "left",
          min: 0,
          max: Math.ceil(Math.max(...yValues)),
        },
      ],
      series: [
        {
          name: "미국채10년물",
          type: "line",
          data: yValues,
          emphasis: { focus: "series" },
          yAxisIndex: 0,
          itemStyle: { color: "#2C73D2" },
        },
      ],
    };
    setUs10yDataOption(chartData);

    const lastValue = data[data.length - 1];
    setLastUs10yValue(lastValue.value);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="space-y-8 px-2 pt-3 min-h-screen">
      {/* 페이지 헤더 */}
      <DashboardHeader
        title="Market Metrics"
        description="Monitor key market indicators and economic metrics"
        onRefresh={fetchData}
      />

      {/* VIX와 VXN - 상세 정보가 있는 큰 카드들 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">VIX</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastVixValue}</span>
            </div>
          </div>

          <div className="h-64 mb-4">
            {vixDataOption ? (
              <EChartsComponent chartData={vixDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium text-gray-700 mb-3">VIX 지수 해석:</p>
            <ul className="space-y-1">
              <li>
                <span className="font-semibold">0~15:</span> 안정/낙관, 위험 선호
              </li>
              <li>
                <span className="font-semibold">15~20:</span> 보통 수준의 변동성
              </li>
              <li>
                <span className="font-semibold">20~30:</span> 다소 불안정
              </li>
              <li>
                <span className="font-semibold">30~40:</span> 고변동성/불안확대
              </li>
              <li>
                <span className="font-semibold">40이상:</span> 공포극심
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              S&P500 지수 옵션의 변동성을 기반으로 만든 공포 지수로, 향후 30일간의 S&P500 변동성 예상을 수치화
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">VXN</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastVxnValue}</span>
            </div>
          </div>

          <div className="h-64 mb-4">
            {vxnDataOption ? (
              <EChartsComponent chartData={vxnDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-medium text-gray-700 mb-3">VXN 지수 해석:</p>
            <ul className="space-y-1">
              <li>
                <span className="font-semibold">0~15:</span> 안정/기술주 낙관
              </li>
              <li>
                <span className="font-semibold">15~25:</span> 보통 수준의 변동성
              </li>
              <li>
                <span className="font-semibold">25~35:</span> 기술주 조정 우려
              </li>
              <li>
                <span className="font-semibold">35이상:</span> 공포극심/매도세심화
              </li>
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              NASDAQ-100 지수 옵션의 변동성을 반영한 지수로, 기술주에 대한 투자자 불안 심리 측정
            </p>
          </div>
        </div>
      </div>

      {/* 주요 지수들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">S&P 500</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastSp500Value}</span>
            </div>
          </div>
          <div className="h-48">
            {sp500DataOption ? (
              <EChartsComponent chartData={sp500DataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Nasdaq 100</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastNdxValue}</span>
            </div>
          </div>
          <div className="h-48">
            {ndxDataOption ? (
              <EChartsComponent chartData={ndxDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">달러환율</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastUsdkrValue}</span>
            </div>
          </div>
          <div className="h-48">
            {usdkrDataOption ? (
              <EChartsComponent chartData={usdkrDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 원자재 및 채권 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Gold</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastGoldValue}</span>
            </div>
          </div>
          <div className="h-48">
            {goldDataOption ? (
              <EChartsComponent chartData={goldDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">미국채 10년물</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastUs10yValue}</span>
            </div>
          </div>
          <div className="h-48">
            {us10yDataOption ? (
              <EChartsComponent chartData={us10yDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">WTI Oil</h3>
            <div className="flex items-center text-sm text-gray-600">
              Today&nbsp;
              <span className="text-xl font-bold text-gray-900 ml-1">{lastOilValue}</span>
            </div>
          </div>
          <div className="h-48">
            {oilDataOption ? (
              <EChartsComponent chartData={oilDataOption} width={"100%"} height={"100%"} />
            ) : (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

export default MetricsPage;
