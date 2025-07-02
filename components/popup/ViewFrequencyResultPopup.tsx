import React, { useState, useEffect } from "react";
import IconButton from "../button/IconButton";
import DownloadButton from "../button/DownloadButton";
import { SearchListItem } from "@/model/SearchListItem";
import { PipeTaskStateColor } from "@/lib/contant";
import { FrequencyListItem } from "@/model/FrequencyListItem";
import { TextminingService } from "@/services/TextminingService";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactECharts from "echarts-for-react";
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

interface ViewFrequencyResultPopupProps {
  open: boolean;
  item: FrequencyListItem | null;
  onClose: () => void;
}

const ViewFrequencyResultPopup: React.FC<ViewFrequencyResultPopupProps> = ({
  open,
  item,
  onClose,
}: ViewFrequencyResultPopupProps) => {
  if (!open || !item) return null;

  const [showPreview, setShowPreview] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [itemList, setItemList] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const fetchData = async (taskId: number, page: number = 1, isInitial: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call when getFrequencyData is implemented
      const serv = new TextminingService();
      const _frequencyData = await serv.getFrequencyData(taskId, page);
      console.log("Fetched frequency data:", _frequencyData);

      if (isInitial) {
        setItemList(_frequencyData.list || []);
        setCurrentCount(_frequencyData.itemCount || 0);
        setPageNo(2); // Next page to fetch
      } else {
        setItemList(prev => [...prev, ...(_frequencyData.list || [])]);
        setCurrentCount(prev => prev + (_frequencyData.itemCount || 0));
        setPageNo(prev => prev + 1);
      }

      setTotalCount(_frequencyData.totalCount || 0);
      setHasMore(
        (_frequencyData.itemCount || 0) > 0 &&
          currentCount + (_frequencyData.itemCount || 0) < (_frequencyData.totalCount || 0)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <HeaderSection
          title="Frequency Analysis Result Details"
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
                  analysisType="Frequency Analysis"
                  analysisDescription="Word frequency distribution and statistical analysis"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <ResultInfoTitelSection />
                <DataCountSection count={item.count} description="Total Words Analyzed" unit="words" />
                <DownloadResultFileSection url={item.s3Url} size={item.fileSize} />
                <PreviewSection isShow={showPreview} handler={handleShowPreview} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <TaskStatusSection item={item} />
              </div>
            </div>
          </div>

          {/* Data Preview Section */}
          {showPreview && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BulletIconAnalysisPreview />
                  Frequency Analysis Preview
                  <span className="ml-2 text-sm font-normal text-gray-500">(Word frequency distribution)</span>
                </h3>
                <div className="flex items-center space-x-3">
                  {totalCount > 0 && (
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-lg border">
                      Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} words
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
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
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
                            <span className="text-gray-500">Loading more data...</span>
                          </div>
                        }
                        endMessage={
                          <div className="flex items-center justify-center py-6 border-t bg-gray-50">
                            <div className="text-center">
                              <svg
                                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <p className="text-gray-500 font-medium">All data loaded</p>
                              <p className="text-sm text-gray-400">{totalCount.toLocaleString()} words total</p>
                            </div>
                          </div>
                        }
                        scrollableTarget="scrollableDiv"
                        className="divide-y divide-gray-100"
                      >
                        {itemList.map((wordData, index) => (
                          <div key={`word-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                                  #{index + 1}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-lg">{wordData.word}</h4>
                                  <p className="text-sm text-gray-500 capitalize">{wordData.pos}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600">
                                  {wordData.count.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">occurrences</div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${Math.min((wordData.count / (itemList[0]?.count || 1)) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </InfiniteScroll>
                    </div>
                  ) : (
                    <div className="p-6">
                      {/* ECharts Bar Chart */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <BulletIconAnalysis />
                          Top 20 Words by Frequency
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Interactive bar chart showing the most frequent words with color coding by part of speech
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
                                  <div style="color: #666;">Part of Speech: ${data.data.pos}</div>
                                  <div style="color: #666;">Frequency: <strong>${data.value.toLocaleString()}</strong></div>
                                `;
                              },
                            },
                            xAxis: {
                              type: "category",
                              data: itemList.slice(0, 20).map((item: any) => item.word),
                              axisLabel: {
                                rotate: 45,
                                interval: 0,
                                fontSize: 11,
                              },
                            },
                            yAxis: {
                              type: "value",
                              name: "Frequency",
                              nameTextStyle: {
                                color: "#666",
                              },
                            },
                            series: [
                              {
                                data: itemList.slice(0, 20).map((item: any) => ({
                                  value: item.count,
                                  pos: item.pos,
                                  itemStyle: {
                                    color:
                                      item.pos === "Noun"
                                        ? "#10b981"
                                        : item.pos === "Verb"
                                          ? "#3b82f6"
                                          : item.pos === "Adjective"
                                            ? "#8b5cf6"
                                            : "#6b7280",
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
                              bottom: "15%",
                              containLabel: true,
                            },
                          }}
                          style={{ height: "350px", width: "100%" }}
                        />
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-center space-x-6 mb-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-700">Noun</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-700">Verb</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-700">Adjective</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-gray-500 rounded mr-2"></div>
                          <span className="text-sm text-gray-700">Other</span>
                        </div>
                      </div>

                      {/* Simplified Bar View */}
                      <div className="space-y-3 max-h-64 overflow-auto bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-3">Detailed View (Top 20)</h5>
                        {itemList.slice(0, 20).map((wordData, index) => {
                          const maxCount = itemList[0]?.count || 1;
                          const percentage = (wordData.count / maxCount) * 100;

                          const getBarColor = (pos: string) => {
                            switch (pos) {
                              case "Noun":
                                return "from-green-400 to-green-600";
                              case "Verb":
                                return "from-blue-400 to-blue-600";
                              case "Adjective":
                                return "from-purple-400 to-purple-600";
                              default:
                                return "from-gray-400 to-gray-600";
                            }
                          };

                          return (
                            <div key={`chart-word-${index}`} className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold">
                                    #{index + 1}
                                  </div>
                                  <span className="font-medium text-gray-900 min-w-0 truncate">{wordData.word}</span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      wordData.pos === "Noun"
                                        ? "bg-green-100 text-green-800"
                                        : wordData.pos === "Verb"
                                          ? "bg-blue-100 text-blue-800"
                                          : wordData.pos === "Adjective"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {wordData.pos}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-gray-700 ml-2">
                                  {wordData.count.toLocaleString()}
                                </span>
                              </div>
                              <div className="bg-gray-200 rounded-full h-3 group-hover:h-4 transition-all duration-200">
                                <div
                                  className={`bg-gradient-to-r ${getBarColor(wordData.pos)} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                                  style={{ width: `${Math.max(percentage, 2)}%` }}
                                >
                                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {itemList.length > 20 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
                          <p className="text-blue-800 text-sm">
                            Showing top 20 words. Switch to List view to see all {totalCount.toLocaleString()} words.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Frequency Analysis Visualization</p>
                    <p>
                      <strong>List View:</strong> Shows all words with infinite scroll and detailed statistics.
                      <br />
                      <strong>Chart View:</strong> Visual bar chart of top 20 words with color-coded parts of speech.
                      Colors represent: <span className="font-medium text-green-700">Green = Nouns</span>,
                      <span className="font-medium text-blue-700"> Blue = Verbs</span>,
                      <span className="font-medium text-purple-700"> Purple = Adjectives</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex-shrink-0">
          <PopupFooter item={item} onClose={onClose} />
        </div>
      </div>

      {/* Fullscreen Data Preview Modal */}
      {isFullscreen && showPreview && (
        <div className="fixed inset-0 z-[60] bg-white">
          {/* Fullscreen Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BulletIconAnalysis className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Frequency Analysis - Full Screen</h2>
                  <p className="text-blue-200 text-sm">
                    #{item.id} • {item.searchKeyword}
                    {totalCount > 0 && (
                      <span className="ml-4">
                        Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} words
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode(ViewMode.LIST)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewMode === ViewMode.LIST
                        ? "bg-white text-blue-700 font-medium"
                        : "text-blue-100 hover:text-white"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode(ViewMode.CHART)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      viewMode === ViewMode.CHART
                        ? "bg-white text-blue-700 font-medium"
                        : "text-blue-100 hover:text-white"
                    }`}
                  >
                    Chart
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Exit Fullscreen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5"
                      />
                    </svg>
                  </button>
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
          </div>

          {/* Fullscreen Content */}
          <div className="h-full overflow-hidden" style={{ height: "calc(100vh - 80px)" }}>
            {error && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg">
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
              <div className="h-full bg-gray-50">
                {viewMode === "list" ? (
                  <div id="fullscreenScrollableDiv" className="h-full overflow-auto p-6">
                    <InfiniteScroll
                      dataLength={itemList.length}
                      next={fetchMoreData}
                      hasMore={hasMore}
                      loader={
                        <div className="flex items-center justify-center py-8">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-400"
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
                          <span className="text-gray-500 text-lg">Loading more data...</span>
                        </div>
                      }
                      endMessage={
                        <div className="flex items-center justify-center py-12 border-t bg-white rounded-lg mx-auto max-w-md mt-6">
                          <div className="text-center">
                            <svg
                              className="w-12 h-12 text-gray-400 mx-auto mb-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-gray-500 font-medium text-lg">All data loaded</p>
                            <p className="text-gray-400">{totalCount.toLocaleString()} words total</p>
                          </div>
                        </div>
                      }
                      scrollableTarget="fullscreenScrollableDiv"
                      className="space-y-4"
                    >
                      {itemList.map((wordData, index) => (
                        <div
                          key={`fullscreen-word-${index}`}
                          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-lg text-sm font-bold min-w-0">
                                #{index + 1}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-gray-900 text-2xl truncate">{wordData.word}</h4>
                                <p className="text-gray-500 capitalize text-lg">{wordData.pos}</p>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-4xl font-bold text-blue-600">{wordData.count.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">occurrences</div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="bg-gray-200 rounded-full h-4">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min((wordData.count / (itemList[0]?.count || 1)) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <div className="h-full overflow-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                      {/* ECharts Bar Chart - Fullscreen */}
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                          <BulletIconAnalysis className="w-6 h-6 mr-3" />
                          Top 30 Words by Frequency
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Interactive bar chart showing the most frequent words with color coding by part of speech
                        </p>

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
                                  <div style="font-weight: bold; margin-bottom: 4px; font-size: 14px;">${data.name}</div>
                                  <div style="color: #666; margin-bottom: 2px;">Part of Speech: <strong>${data.data.pos}</strong></div>
                                  <div style="color: #666;">Frequency: <strong>${data.value.toLocaleString()}</strong></div>
                                `;
                              },
                            },
                            xAxis: {
                              type: "category",
                              data: itemList.slice(0, 30).map((item: any) => item.word),
                              axisLabel: {
                                rotate: 45,
                                interval: 0,
                                fontSize: 12,
                                color: "#666",
                              },
                              axisLine: {
                                lineStyle: {
                                  color: "#ddd",
                                },
                              },
                            },
                            yAxis: {
                              type: "value",
                              name: "Frequency",
                              nameTextStyle: {
                                color: "#666",
                                fontSize: 14,
                              },
                              axisLabel: {
                                color: "#666",
                              },
                              axisLine: {
                                lineStyle: {
                                  color: "#ddd",
                                },
                              },
                              splitLine: {
                                lineStyle: {
                                  color: "#f0f0f0",
                                },
                              },
                            },
                            series: [
                              {
                                data: itemList.slice(0, 30).map((item: any) => ({
                                  value: item.count,
                                  pos: item.pos,
                                  itemStyle: {
                                    color:
                                      item.pos === "Noun"
                                        ? "#10b981"
                                        : item.pos === "Verb"
                                          ? "#3b82f6"
                                          : item.pos === "Adjective"
                                            ? "#8b5cf6"
                                            : "#6b7280",
                                  },
                                })),
                                type: "bar",
                                barWidth: "70%",
                                label: {
                                  show: true,
                                  position: "top",
                                  formatter: "{c}",
                                  fontSize: 11,
                                  color: "#666",
                                },
                              },
                            ],
                            grid: {
                              left: "5%",
                              right: "5%",
                              bottom: "20%",
                              top: "10%",
                              containLabel: true,
                            },
                          }}
                          style={{ height: "500px", width: "100%" }}
                        />

                        {/* Legend for fullscreen */}
                        <div className="flex items-center justify-center space-x-8 mt-6 bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-green-500 rounded mr-3"></div>
                            <span className="text-gray-700 font-medium">Noun</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-blue-500 rounded mr-3"></div>
                            <span className="text-gray-700 font-medium">Verb</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-purple-500 rounded mr-3"></div>
                            <span className="text-gray-700 font-medium">Adjective</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 bg-gray-500 rounded mr-3"></div>
                            <span className="text-gray-700 font-medium">Other</span>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Bar View for fullscreen */}
                      <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h4 className="text-xl font-bold text-gray-900 mb-4">Detailed View (Top 30)</h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {itemList.slice(0, 30).map((wordData, index) => {
                            const maxCount = itemList[0]?.count || 1;
                            const percentage = (wordData.count / maxCount) * 100;

                            const getBarColor = (pos: string) => {
                              switch (pos) {
                                case "Noun":
                                  return "from-green-400 to-green-600";
                                case "Verb":
                                  return "from-blue-400 to-blue-600";
                                case "Adjective":
                                  return "from-purple-400 to-purple-600";
                                default:
                                  return "from-gray-400 to-gray-600";
                              }
                            };

                            return (
                              <div
                                key={`fullscreen-chart-word-${index}`}
                                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-bold">
                                      #{index + 1}
                                    </div>
                                    <span className="font-bold text-gray-900 text-lg">{wordData.word}</span>
                                    <span
                                      className={`text-sm px-3 py-1 rounded-full font-medium ${
                                        wordData.pos === "Noun"
                                          ? "bg-green-100 text-green-800"
                                          : wordData.pos === "Verb"
                                            ? "bg-blue-100 text-blue-800"
                                            : wordData.pos === "Adjective"
                                              ? "bg-purple-100 text-purple-800"
                                              : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {wordData.pos}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xl font-bold text-gray-700">
                                      {wordData.count.toLocaleString()}
                                    </span>
                                    <span className="text-blue-600 text-sm font-medium ml-2">
                                      ({percentage.toFixed(1)}%)
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-gray-200 rounded-full h-4 group-hover:h-5 transition-all duration-200">
                                  <div
                                    className={`bg-gradient-to-r ${getBarColor(wordData.pos)} h-full rounded-full transition-all duration-700 flex items-center justify-end pr-3`}
                                    style={{ width: `${Math.max(percentage, 3)}%` }}
                                  >
                                    <span className="text-white text-sm font-bold">{percentage.toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewFrequencyResultPopup;
