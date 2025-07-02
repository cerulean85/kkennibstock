import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactECharts from "echarts-for-react";
import IconButton from "../button/IconButton";
import DownloadButton from "../button/DownloadButton";
import { ConcorListItem } from "@/model/ConcorListItem";
import { PipeTaskStateColor } from "@/lib/contant";
import { TextminingService } from "@/services/TextminingService";
import {
  AnalysisInfoSection,
  DataCountSection,
  DownloadResultFileSection,
  HeaderSection,
  PopupFooter,
  PreviewSection,
  ResultInfoTitelSection,
  SearchInfoSection,
  TaskStatusSection,
} from "./PopupSections";
import { PreviewSelectionButton, ViewFullScreenButton, ViewMode } from "../button/PopupButton";
import { BulletIconAnalysis, BulletIconAnalysisPreview } from "../icon/BulletIcon";

interface ViewConcorResultPopupProps {
  open: boolean;
  item: ConcorListItem | null;
  onClose: () => void;
}

// Concordance data structure for Preview
interface ConcorDataItem {
  word1: string;
  pos1: string;
  word1Frequency: number;
  word2: string;
  pos2: string;
  word2Frequency: number;
  count: number;
}

const ViewConcorResultPopup: React.FC<ViewConcorResultPopupProps> = ({
  open,
  item,
  onClose,
}: ViewConcorResultPopupProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [itemList, setItemList] = useState<ConcorDataItem[]>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchData = async (taskId: number, page: number = 1, isInitial: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call when getFrequencyData is implemented
      const serv = new TextminingService();
      const _concorData = await serv.getConcorData(taskId, page);
      console.log("Fetched concor data:", _concorData);

      if (isInitial) {
        setItemList(_concorData.list || []);
        setCurrentCount(_concorData.itemCount || 0);
        setPageNo(2); // Next page to fetch
      } else {
        setItemList(prev => [...prev, ...(_concorData.list || [])]);
        setCurrentCount(prev => prev + (_concorData.itemCount || 0));
        setPageNo(prev => prev + 1);
      }

      setTotalCount(_concorData.totalCount || 0);
      setHasMore(
        (_concorData.itemCount || 0) > 0 && currentCount + (_concorData.itemCount || 0) < (_concorData.totalCount || 0)
      );
    } catch (error) {
      console.error("Error fetching frequency data:", error);
      setError("Failed to load preview data. Please try again.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoreData = () => {
    if (!item || isLoading || !hasMore) return;
    fetchData(item.id, pageNo, false);
  };

  const handleShowPreview = async () => {
    if (!showPreview && itemList.length === 0 && item) {
      await fetchData(item.id, 1, true);
    }
    setShowPreview(!showPreview);
  };

  useEffect(() => {
    if (!open || !item) {
      // Reset state when popup closes
      setItemList([]);
      setPageNo(1);
      setCurrentCount(0);
      setTotalCount(0);
      setHasMore(true);
      setShowPreview(false);
      setIsLoading(false);
      setError(null);
      setIsFullscreen(false);
    }
  }, [open, item]);

  // Handle ESC key for fullscreen exit
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscKey);
      return () => document.removeEventListener("keydown", handleEscKey);
    }
  }, [isFullscreen]);

  // Early return after all hooks are called
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <HeaderSection
          title="Concordance Analysis Result Details"
          id={item.id}
          keyword={item.searchKeyword}
          onClose={onClose}
        />

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 160px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <SearchInfoSection item={item} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <AnalysisInfoSection
                  analysisType="Concordance Analysis"
                  analysisDescription="Word co-occurrence and contextual relationship analysis"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <ResultInfoTitelSection />
                <DataCountSection count={item.count} description="Concordance Pairs Found" unit="pairs" />
                <DownloadResultFileSection url={item.s3Url} size={item.fileSize} />
                <PreviewSection isShow={showPreview} handler={handleShowPreview} />
              </div>
              <TaskStatusSection item={item} />
            </div>
          </div>

          {/* Data Preview Section */}
          {showPreview && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BulletIconAnalysisPreview />
                  Concordance Analysis Preview
                  <span className="ml-2 text-sm font-normal text-gray-500">(Word co-occurrence pairs)</span>
                </h3>
                <div className="flex items-center space-x-3">
                  {totalCount > 0 && (
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-lg border">
                      Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} pairs
                    </div>
                  )}
                  <div className="flex bg-white rounded-lg border p-1">
                    <PreviewSelectionButton
                      currentViewMode={viewMode}
                      targetViewMode={ViewMode.LIST}
                      selector={setViewMode}
                    />
                    <PreviewSelectionButton
                      currentViewMode={viewMode}
                      targetViewMode={ViewMode.CHART}
                      selector={setViewMode}
                    />
                    <PreviewSelectionButton
                      currentViewMode={viewMode}
                      targetViewMode={ViewMode.NETWORK}
                      selector={setViewMode}
                    />
                  </div>
                  <ViewFullScreenButton toggleFullscreen={setIsFullscreen} />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-red-800 font-medium">Unable to load preview</p>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => item && fetchData(item.id, 1, true)}
                    className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!error && (
                <div className="bg-white rounded-lg border">
                  {viewMode === "list" ? (
                    <div id="scrollableDiv" className="max-h-96 overflow-auto">
                      <InfiniteScroll
                        dataLength={itemList.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                          <div className="flex items-center justify-center py-4">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-purple-700 text-sm">Loading more pairs...</span>
                          </div>
                        }
                        scrollableTarget="scrollableDiv"
                      >
                        <div className="divide-y divide-gray-200">
                          {itemList.map((concorItem, index) => (
                            <div
                              key={`${concorItem.word1}-${concorItem.word2}-${index}`}
                              className="p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {concorItem.word1}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {concorItem.pos1}
                                    </span>
                                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                      freq: {concorItem.word1Frequency}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {concorItem.word2}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {concorItem.pos2}
                                    </span>
                                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                                      freq: {concorItem.word2Frequency}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-semibold">
                                    {concorItem.count}
                                  </span>
                                  <span className="text-xs text-gray-500">co-occurrences</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </InfiniteScroll>
                    </div>
                  ) : viewMode === "chart" ? (
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <BulletIconAnalysis />
                          Concordance Chart
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Interactive bar chart showing word pair co-occurrence counts (Top 20)
                        </p>
                      </div>

                      <div className="bg-white rounded-lg border mb-6">
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: "axis",
                              axisPointer: {
                                type: "shadow",
                              },
                              formatter: function (params: any) {
                                const data = params[0];
                                return `
                                  <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
                                  <div style="color: #666;">Co-occurrence Count: <strong>${data.value.toLocaleString()}</strong></div>
                                `;
                              },
                            },
                            xAxis: {
                              type: "category",
                              data: itemList.slice(0, 20).map((item: any) => `${item.word1} ↔ ${item.word2}`),
                              axisLabel: {
                                rotate: 45,
                                interval: 0,
                                fontSize: 10,
                                formatter: function (value: string) {
                                  return value.length > 12 ? value.substring(0, 12) + "..." : value;
                                },
                              },
                            },
                            yAxis: {
                              type: "value",
                              name: "Co-occurrence Count",
                              nameTextStyle: {
                                color: "#666",
                              },
                            },
                            series: [
                              {
                                data: itemList.slice(0, 20).map((item: any, index: number) => ({
                                  value: item.count,
                                  itemStyle: {
                                    color: `hsl(${260 + ((index * 8) % 60)}, 70%, ${60 + (index % 3) * 10}%)`,
                                  },
                                })),
                                type: "bar",
                                barWidth: "60%",
                                label: {
                                  show: true,
                                  position: "top",
                                  formatter: "{c}",
                                  fontSize: 10,
                                },
                              },
                            ],
                            grid: {
                              left: "3%",
                              right: "4%",
                              bottom: "20%",
                              containLabel: true,
                            },
                          }}
                          style={{ height: "350px", width: "100%" }}
                        />
                      </div>

                      {/* Simplified Bar View */}
                      <div className="space-y-3 max-h-64 overflow-auto bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-3">Detailed View (Top 20)</h5>
                        {itemList.slice(0, 20).map((concorItem, index) => {
                          const maxCount = itemList[0]?.count || 1;
                          const percentage = Math.round((concorItem.count / maxCount) * 100);

                          return (
                            <div
                              key={`chart-${concorItem.word1}-${concorItem.word2}-${index}`}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border"
                            >
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {concorItem.word1}
                                  </span>
                                  <span className="text-xs text-gray-400">↔</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {concorItem.word2}
                                  </span>
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-3">
                                <span className="text-sm font-semibold text-gray-900">
                                  {concorItem.count.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Summary Stats */}
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{itemList.length.toLocaleString()}</div>
                          <div className="text-xs text-purple-700">Total Pairs</div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {itemList
                              .slice(0, 20)
                              .reduce((sum, item) => sum + item.count, 0)
                              .toLocaleString()}
                          </div>
                          <div className="text-xs text-blue-700">Top 20 Total</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {itemList[0]?.count?.toLocaleString() || 0}
                          </div>
                          <div className="text-xs text-green-700">Highest Count</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <BulletIconAnalysis />
                          Network Graph
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          This network graph visualizes the relationships between word pairs.
                          <br />
                          <span className="text-xs text-gray-500">
                            • Node color: by part-of-speech (Green=Noun, Blue=Verb, Purple=Adjective) • Node size:
                            proportional to word frequency
                          </span>
                        </p>
                      </div>
                      <ReactECharts option={getNetworkOption(itemList)} style={{ height: isFullscreen ? 700 : 400 }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex-shrink-0">
          <PopupFooter item={item} onClose={onClose} />
        </div>
      </div>

      {isFullscreen && showPreview && (
        <div className="fixed inset-0 z-[60] bg-white">
          <div className="h-full flex flex-col">
            {/* Fullscreen Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">Concordance Analysis Preview - Fullscreen</h2>
                  <p className="text-blue-100 text-sm">
                    #{item.id} • {item.searchKeyword} • {totalCount.toLocaleString()} pairs
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex bg-blue-500 bg-opacity-50 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode(ViewMode.LIST)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        viewMode === "list" ? "bg-white text-blue-700 font-medium" : "text-blue-100 hover:text-white"
                      }`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setViewMode(ViewMode.CHART)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        viewMode === "chart" ? "bg-white text-blue-700 font-medium" : "text-blue-100 hover:text-white"
                      }`}
                    >
                      Chart
                    </button>
                    <button
                      onClick={() => setViewMode(ViewMode.NETWORK)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        viewMode === "network" ? "bg-white text-blue-700 font-medium" : "text-blue-100 hover:text-white"
                      }`}
                    >
                      <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <circle cx="12" cy="7" r="2" fill="currentColor" />
                        <circle cx="7" cy="15" r="2" fill="currentColor" />
                        <circle cx="17" cy="15" r="2" fill="currentColor" />
                        <line x1="12" y1="9" x2="7" y2="13" stroke="currentColor" strokeWidth="2" />
                        <line x1="12" y1="9" x2="17" y2="13" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Network
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setIsFullscreen(false);
                      setShowPreview(false);
                    }}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Close Preview"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Fullscreen Content */}
            <div className="flex-1 overflow-hidden p-6">
              {error ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-red-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-800 font-medium">Unable to load preview</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                    <button
                      onClick={() => item && fetchData(item.id, 1, true)}
                      className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-white rounded-lg border">
                  {viewMode === "list" ? (
                    <div id="fullscreenScrollableDiv" className="h-full overflow-auto">
                      <InfiniteScroll
                        dataLength={itemList.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={
                          <div className="flex items-center justify-center py-4">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span className="text-purple-700 text-sm">Loading more pairs...</span>
                          </div>
                        }
                        scrollableTarget="fullscreenScrollableDiv"
                      >
                        <div className="divide-y divide-gray-200">
                          {itemList.map((concorItem, index) => (
                            <div
                              key={`fs-${concorItem.word1}-${concorItem.word2}-${index}`}
                              className="p-6 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                  <div className="flex items-center space-x-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                      {concorItem.word1}
                                    </span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                      {concorItem.pos1}
                                    </span>
                                    <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">
                                      freq: {concorItem.word1Frequency}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                      {concorItem.word2}
                                    </span>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                                      {concorItem.pos2}
                                    </span>
                                    <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">
                                      freq: {concorItem.word2Frequency}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-lg font-semibold">
                                    {concorItem.count}
                                  </span>
                                  <span className="text-sm text-gray-500">co-occurrences</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </InfiniteScroll>
                    </div>
                  ) : viewMode === "chart" ? (
                    <div className="h-full p-6 overflow-auto">
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                          <BulletIconAnalysis className="w-6 h-6 mr-3" />
                          Concordance Chart - Fullscreen
                        </h4>
                        <p className="text-lg text-gray-600 mb-6">
                          Interactive bar chart showing word pair co-occurrence counts (Top 30)
                        </p>
                      </div>

                      <div className="bg-white rounded-lg border mb-8">
                        <ReactECharts
                          option={{
                            tooltip: {
                              trigger: "axis",
                              axisPointer: {
                                type: "shadow",
                              },
                              formatter: function (params: any) {
                                const data = params[0];
                                return `
                                  <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${data.name}</div>
                                  <div style="color: #666; font-size: 13px;">Co-occurrence Count: <strong style="color: #333;">${data.value.toLocaleString()}</strong></div>
                                `;
                              },
                            },
                            xAxis: {
                              type: "category",
                              data: itemList.slice(0, 30).map((item: any) => `${item.word1} ↔ ${item.word2}`),
                              axisLabel: {
                                rotate: 45,
                                interval: 0,
                                fontSize: 11,
                                formatter: function (value: string) {
                                  return value.length > 15 ? value.substring(0, 15) + "..." : value;
                                },
                              },
                            },
                            yAxis: {
                              type: "value",
                              name: "Co-occurrence Count",
                              nameTextStyle: {
                                color: "#666",
                                fontSize: 14,
                              },
                            },
                            series: [
                              {
                                data: itemList.slice(0, 30).map((item: any, index: number) => ({
                                  value: item.count,
                                  itemStyle: {
                                    color: `hsl(${260 + ((index * 6) % 80)}, 70%, ${55 + (index % 4) * 8}%)`,
                                  },
                                })),
                                type: "bar",
                                barWidth: "70%",
                                label: {
                                  show: true,
                                  position: "top",
                                  formatter: "{c}",
                                  fontSize: 11,
                                },
                              },
                            ],
                            grid: {
                              left: "4%",
                              right: "4%",
                              bottom: "25%",
                              top: "10%",
                              containLabel: true,
                            },
                          }}
                          style={{ height: "500px", width: "100%" }}
                        />
                      </div>

                      {/* Enhanced Summary Stats for Fullscreen */}
                      <div className="grid grid-cols-4 gap-6 mb-8">
                        <div className="bg-purple-50 p-6 rounded-xl text-center">
                          <div className="text-3xl font-bold text-purple-600 mb-2">
                            {itemList.length.toLocaleString()}
                          </div>
                          <div className="text-sm text-purple-700">Total Unique Pairs</div>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-xl text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {itemList
                              .slice(0, 30)
                              .reduce((sum, item) => sum + item.count, 0)
                              .toLocaleString()}
                          </div>
                          <div className="text-sm text-blue-700">Top 30 Total Count</div>
                        </div>
                        <div className="bg-green-50 p-6 rounded-xl text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {itemList[0]?.count?.toLocaleString() || 0}
                          </div>
                          <div className="text-sm text-green-700">Highest Count</div>
                        </div>
                        <div className="bg-orange-50 p-6 rounded-xl text-center">
                          <div className="text-3xl font-bold text-orange-600 mb-2">
                            {itemList.length > 0
                              ? Math.round(
                                  itemList.slice(0, 30).reduce((sum, item) => sum + item.count, 0) /
                                    Math.min(30, itemList.length)
                                )
                              : 0}
                          </div>
                          <div className="text-sm text-orange-700">Average Count (Top 30)</div>
                        </div>
                      </div>

                      {/* Detailed List View for Top Pairs */}
                      <div className="bg-gray-50 p-6 rounded-xl">
                        <h5 className="text-xl font-semibold text-gray-900 mb-4">Top Word Pairs Detail</h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {itemList.slice(0, 20).map((concorItem, index) => {
                            const maxCount = itemList[0]?.count || 1;
                            const percentage = Math.round((concorItem.count / maxCount) * 100);

                            return (
                              <div
                                key={`fs-chart-${concorItem.word1}-${concorItem.word2}-${index}`}
                                className="bg-white p-4 rounded-lg border"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {concorItem.word1}
                                    </span>
                                    <span className="text-xs text-gray-400">↔</span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {concorItem.word2}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-lg font-bold text-gray-900">
                                      {concorItem.count.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500">({percentage}%)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                  <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>
                                    {concorItem.pos1} → {concorItem.pos2}
                                  </span>
                                  <span>Rank #{index + 1}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-6 overflow-auto">
                      <div className="mb-6">
                        <h4 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                          <BulletIconAnalysis className="w-6 h-6 mr-3" />
                          Network Graph
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          This network graph visualizes the relationships between word pairs.
                          <br />
                          <span className="text-xs text-gray-500">
                            • Node color: by part-of-speech (Green=Noun, Blue=Verb, Purple=Adjective) • Node size:
                            proportional to word frequency
                          </span>
                        </p>
                      </div>
                      <ReactECharts option={getNetworkOption(itemList)} style={{ height: isFullscreen ? 700 : 400 }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getNetworkOption(data: ConcorDataItem[]) {
  // pos별 색상 및 카테고리 정의 (ViewCleanResultPopup과 일치하도록 수정)
  const posColorMap: { [key: string]: string } = {
    Noun: "#10B981", // 초록 (ViewCleanResultPopup과 동일)
    Verb: "#3B82F6", // 파랑 (ViewCleanResultPopup과 동일)
    Adjective: "#8B5CF6", // 보라 (ViewCleanResultPopup과 동일)
    Adverb: "#9333EA", // 진한 보라
    Determiner: "#EA580C", // 진한 주황
    Exclamation: "#D97706", // 진한 노랑
    Particle: "#4F46E5", // 진한 인디고
    Suffix: "#374151", // 진한 회색
    Unknown: "#6B7280", // 중간 회색
  };

  // pos별 카테고리 추출
  const posSet = new Set<string>();
  data.forEach(item => {
    posSet.add(item.pos1);
    posSet.add(item.pos2);
  });
  const posList = Array.from(posSet);
  const categories = posList.map(pos => ({
    name: pos,
    itemStyle: { color: posColorMap[pos] || "#6B7280" },
  }));

  // 노드와 링크 생성 (빈도에 따른 크기 조정 개선)
  const nodesMap: { [key: string]: any } = {};
  const links: any[] = [];

  // 빈도 범위 계산하여 더 나은 크기 스케일링
  const frequencies = data.flatMap(item => [item.word1Frequency, item.word2Frequency]);
  const minFreq = Math.min(...frequencies);
  const maxFreq = Math.max(...frequencies);

  data.forEach(item => {
    if (!nodesMap[item.word1]) {
      // 빈도에 따른 노드 크기 (10-50 범위로 조정)
      const normalizedSize = 15 + ((item.word1Frequency - minFreq) / (maxFreq - minFreq)) * 35;
      nodesMap[item.word1] = {
        id: item.word1,
        name: item.word1,
        value: item.word1Frequency,
        symbolSize: Math.max(15, normalizedSize),
        category: posList.indexOf(item.pos1),
        itemStyle: {
          color: posColorMap[item.pos1] || "#6B7280",
          borderColor: "#FFFFFF",
          borderWidth: 1,
        },
        pos: item.pos1,
        frequency: item.word1Frequency,
      };
    }
    if (!nodesMap[item.word2]) {
      // 빈도에 따른 노드 크기 (10-50 범위로 조정)
      const normalizedSize = 15 + ((item.word2Frequency - minFreq) / (maxFreq - minFreq)) * 35;
      nodesMap[item.word2] = {
        id: item.word2,
        name: item.word2,
        value: item.word2Frequency,
        symbolSize: Math.max(15, normalizedSize),
        category: posList.indexOf(item.pos2),
        itemStyle: {
          color: posColorMap[item.pos2] || "#6B7280",
          borderColor: "#FFFFFF",
          borderWidth: 1,
        },
        pos: item.pos2,
        frequency: item.word2Frequency,
      };
    }
    links.push({
      source: item.word1,
      target: item.word2,
      value: item.count,
      lineStyle: { width: Math.max(1, Math.log(item.count + 1) * 2) },
      label: { show: false },
    });
  });
  return {
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        if (params.dataType === "node") {
          return `<div style="font-size: 12px;">
            <b style="color: ${params.data.itemStyle.color};">${params.data.name}</b><br/>
            <span style="color: #666;">POS:</span> <b>${params.data.pos}</b><br/>
            <span style="color: #666;">Frequency:</span> <b>${params.data.frequency}</b>
          </div>`;
        } else if (params.dataType === "edge") {
          return `<div style="font-size: 12px;">
            <b>${params.data.source} → ${params.data.target}</b><br/>
            <span style="color: #666;">Count:</span> <b>${params.data.value}</b>
          </div>`;
        }
        return "";
      },
    },
    legend: [
      {
        data: posList,
        orient: "vertical",
        left: 0,
        top: "center",
        textStyle: { fontSize: 12 },
        itemGap: 8,
        formatter: function (name: string) {
          return `${name}`;
        },
      },
    ],
    series: [
      {
        type: "graph",
        layout: "circular", // Make the graph static
        roam: false, // Disable zoom/pan
        draggable: false, // Disable node dragging
        data: Object.values(nodesMap),
        links: links,
        categories: categories,
        label: {
          show: true,
          position: "right",
          formatter: "{b}",
          fontSize: 11,
          fontWeight: "bold",
        },
        force: {
          repulsion: 250,
          edgeLength: 150,
          gravity: 0.1,
        },
        lineStyle: {
          color: "#999",
          opacity: 0.6,
          curveness: 0.1,
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 3,
            opacity: 0.9,
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.3)",
          },
        },
      },
    ],
  };
}

export default ViewConcorResultPopup;
