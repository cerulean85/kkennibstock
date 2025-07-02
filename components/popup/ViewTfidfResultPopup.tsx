import React, { useState, useEffect } from "react";
import IconButton from "../button/IconButton";
import DownloadButton from "../button/DownloadButton";
import { PipeTaskStateColor } from "@/lib/contant";
import { TfidfListItem } from "@/model/TfidfListItem";
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

interface ViewTfidfResultPopupProps {
  open: boolean;
  item: TfidfListItem | null;
  onClose: () => void;
}

const ViewTfidfResultPopup: React.FC<ViewTfidfResultPopupProps> = ({
  open,
  item,
  onClose,
}: ViewTfidfResultPopupProps) => {
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
  const [selectedCluster, setSelectedCluster] = useState<number>(0);

  // Chart scroll handlers
  const handleSentenceSelect = (index: number) => {
    setSelectedCluster(index);

    // Scroll to chart when sentence is selected in chart view
    if (viewMode === "chart") {
      setTimeout(() => {
        const chartElement = document.getElementById(`chart-${index}`);
        if (chartElement) {
          chartElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100); // Small delay to ensure state update
    }
  };

  // Fullscreen chart scroll handler
  const handleFullscreenSentenceSelect = (index: number) => {
    setSelectedCluster(index);

    // Scroll to chart when sentence is selected in fullscreen chart view
    if (viewMode === "chart") {
      setTimeout(() => {
        const chartElement = document.getElementById(`fullscreen-chart-${index}`);
        if (chartElement) {
          chartElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100); // Small delay to ensure state update
    }
  };

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
      // TODO: Replace with actual API call when getTfidfData is implemented
      const serv = new TextminingService();
      const _tfidfData = await serv.getTfidfData(taskId, page);
      console.log("Fetched TF-IDF data:", _tfidfData);

      if (isInitial) {
        setItemList(_tfidfData.list || []);
        setCurrentCount(_tfidfData.itemCount || 0);
        setPageNo(2); // Next page to fetch
      } else {
        setItemList(prev => [...prev, ...(_tfidfData.list || [])]);
        setCurrentCount(prev => prev + (_tfidfData.itemCount || 0));
        setPageNo(prev => prev + 1);
      }

      setTotalCount(_tfidfData.totalCount || 0);
      setHasMore(
        (_tfidfData.itemCount || 0) > 0 && currentCount + (_tfidfData.itemCount || 0) < (_tfidfData.totalCount || 0)
      );
    } catch (error) {
      console.error("Error fetching TF-IDF data:", error);
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
      setSelectedCluster(0);
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

  // Reset selectedCluster when switching to chart view or when data changes
  useEffect(() => {
    if (viewMode === "chart" && itemList.length > 0) {
      if (selectedCluster >= itemList.length) {
        setSelectedCluster(0);
      }
    }
  }, [viewMode, itemList.length, selectedCluster]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <HeaderSection
          title="TF-IDF Analysis Result Details"
          id={item.id}
          keyword={item.searchKeyword}
          onClose={onClose}
        />

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 160px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <SearchInfoSection item={item} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <AnalysisInfoSection
                  analysisType="TF-IDF Analysis"
                  analysisDescription="Term Frequency-Inverse Document Frequency clustering analysis"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <ResultInfoTitelSection />
                <DataCountSection count={item.count} description="Total Documents Analyzed" unit="documents" />
                <DownloadResultFileSection url={item.s3Url} size={item.fileSize} />
                <PreviewSection isShow={showPreview} handler={handleShowPreview} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <TaskStatusSection item={item} />
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BulletIconAnalysisPreview />
                  TF-IDF Analysis Preview
                  <span className="ml-2 text-sm font-normal text-gray-500">(Sentence-based TF-IDF analysis)</span>
                </h3>
                <div className="flex items-center space-x-3">
                  {totalCount > 0 && (
                    <div className="text-sm text-slate-600 bg-white px-3 py-1 rounded-lg border">
                      Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} sentences
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
                            <span className="text-gray-500">Loading more sentences...</span>
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
                              <p className="text-gray-500 font-medium">All sentences loaded</p>
                              <p className="text-sm text-gray-400">{totalCount.toLocaleString()} sentences total</p>
                            </div>
                          </div>
                        }
                        scrollableTarget="scrollableDiv"
                        className="divide-y divide-gray-100"
                      >
                        {itemList.map((sentence, sentenceIndex) => (
                          <div key={`sentence-${sentenceIndex}`} className="p-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-lg text-sm font-bold">
                                  Sentence #{sentence.sentence_index}
                                </div>
                                <div className="text-sm text-gray-600">{sentence.tokens.length} key terms</div>
                              </div>
                              <div className="text-sm text-gray-500">
                                Max Score: {Math.max(...sentence.tokens.map((term: any) => term.value)).toFixed(4)}
                              </div>
                            </div>

                            {/* Sentence Terms */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {sentence.tokens.slice(0, 8).map((term: any, termIndex: number) => (
                                <div
                                  key={`term-${sentenceIndex}-${termIndex}`}
                                  className="flex items-center justify-between bg-slate-50 rounded-lg p-2"
                                >
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-900">{term.word}</span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        term.pos === "Noun"
                                          ? "bg-blue-100 text-blue-800"
                                          : term.pos === "Verb"
                                            ? "bg-cyan-100 text-cyan-800"
                                            : term.pos === "Adjective"
                                              ? "bg-fuchsia-100 text-fuchsia-800"
                                              : "bg-slate-100 text-slate-800"
                                      }`}
                                    >
                                      {term.pos}
                                    </span>
                                  </div>
                                  <div className="text-cyan-700 font-bold text-sm">{term.value.toFixed(3)}</div>
                                </div>
                              ))}
                            </div>

                            {sentence.tokens.length > 8 && (
                              <div className="mt-2 text-center">
                                <span className="text-sm text-slate-500">+{sentence.tokens.length - 8} more terms</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </InfiniteScroll>
                    </div>
                  ) : (
                    <div className="p-6">
                      {/* Cluster Selection */}
                      {itemList.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                            <BulletIconAnalysis />
                            TF-IDF Score Visualization
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">Select a sentence to view detailed TF-IDF scores</p>

                          {/* Sentence Tabs */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {itemList.map((sentence, index) => (
                              <button
                                key={`sentence-tab-${index}`}
                                onClick={() => handleSentenceSelect(index)}
                                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                  selectedCluster === index
                                    ? "bg-indigo-100 text-indigo-700 font-medium border border-indigo-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                              >
                                Sentence {sentence.sentence_index}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ECharts for selected cluster */}
                      {itemList.length > 0 && selectedCluster < itemList.length && itemList[selectedCluster] && (
                        <div id={`chart-${selectedCluster}`} className="bg-white rounded-lg border mb-6">
                          <ReactECharts
                            key={`chart-${selectedCluster}`}
                            option={{
                              title: {
                                text: `Sentence ${itemList[selectedCluster]?.sentence_index} - TF-IDF Scores`,
                                left: "center",
                                textStyle: {
                                  fontSize: 16,
                                  fontWeight: "bold",
                                },
                              },
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
                                    <div style="color: #666;">TF-IDF Score: <strong>${data.value.toFixed(4)}</strong></div>
                                  `;
                                },
                              },
                              xAxis: {
                                type: "category",
                                data: itemList[selectedCluster]?.tokens?.map((item: any) => item.word) || [],
                                axisLabel: {
                                  rotate: 45,
                                  interval: 0,
                                  fontSize: 11,
                                },
                              },
                              yAxis: {
                                type: "value",
                                name: "TF-IDF Score",
                                nameTextStyle: {
                                  color: "#666",
                                },
                              },
                              series: [
                                {
                                  data:
                                    itemList[selectedCluster]?.tokens?.map((item: any) => ({
                                      value: item.value,
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
                                    })) || [],
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
                      )}

                      {/* Legend */}
                      <div className="flex items-center justify-center space-x-6 mb-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-teal-500 rounded mr-2"></div>
                          <span className="text-sm text-slate-700">Noun</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-cyan-500 rounded mr-2"></div>
                          <span className="text-sm text-slate-700">Verb</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-fuchsia-500 rounded mr-2"></div>
                          <span className="text-sm text-slate-700">Adjective</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-slate-500 rounded mr-2"></div>
                          <span className="text-sm text-slate-700">Other</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
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
                    <p className="font-medium mb-1">TF-IDF Analysis Visualization</p>
                    <p>
                      <strong>Sentences View:</strong> Shows sentences with key terms and their TF-IDF scores.
                      <br />
                      <strong>Chart View:</strong> Interactive bar chart visualization of TF-IDF scores by sentence.
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

      {isFullscreen && showPreview && (
        <div className="fixed inset-0 z-[60] bg-white">
          {/* Fullscreen Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-3 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
                <div>
                  <h2 className="text-xl font-bold">TF-IDF Analysis - Full Screen</h2>
                  <p className="text-indigo-200 text-sm">
                    #{item.id} • {item.searchKeyword}
                    {totalCount > 0 && (
                      <span className="ml-4">
                        Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} sentences
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex bg-white bg-opacity-20 rounded-lg p-1">
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
                          <span className="text-gray-500 text-lg">Loading more sentences...</span>
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
                            <p className="text-gray-500 font-medium text-lg">All sentences loaded</p>
                            <p className="text-gray-400">{totalCount.toLocaleString()} sentences total</p>
                          </div>
                        </div>
                      }
                      scrollableTarget="fullscreenScrollableDiv"
                      className="space-y-6"
                    >
                      {itemList.map((sentence, sentenceIndex) => (
                        <div
                          key={`fullscreen-sentence-${sentenceIndex}`}
                          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg text-lg font-bold">
                                Sentence #{sentence.sentence_index}
                              </div>
                              <div className="text-gray-600">
                                <span className="font-medium">{sentence.tokens.length}</span> key terms
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Max TF-IDF Score</div>
                              <div className="text-2xl font-bold text-indigo-600">
                                {Math.max(...sentence.tokens.map((term: any) => term.value)).toFixed(4)}
                              </div>
                            </div>
                          </div>

                          {/* Enhanced sentence terms display */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sentence.tokens.map((term: any, termIndex: number) => (
                              <div
                                key={`fullscreen-term-${sentenceIndex}-${termIndex}`}
                                className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-gray-900 text-lg">{term.word}</span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        term.pos === "Noun"
                                          ? "bg-green-100 text-green-800"
                                          : term.pos === "Verb"
                                            ? "bg-blue-100 text-blue-800"
                                            : term.pos === "Adjective"
                                              ? "bg-purple-100 text-purple-800"
                                              : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {term.pos}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-indigo-600 font-bold text-lg">{term.value.toFixed(4)}</div>
                                  <div className="bg-gray-200 rounded-full h-2 flex-1 ml-3">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                      style={{
                                        width: `${(term.value / Math.max(...sentence.tokens.map((t: any) => t.value))) * 100}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </InfiniteScroll>
                  </div>
                ) : (
                  <div className="h-full overflow-auto p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                      {/* Enhanced Cluster Selection for fullscreen */}
                      {itemList.length > 0 && (
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                            <BulletIconAnalysis className="w-6 h-6 mr-3" />
                            TF-IDF Score Analysis
                          </h3>
                          <p className="text-gray-600 mb-6">Explore detailed TF-IDF scores for each sentence</p>

                          {/* Enhanced Sentence Tabs */}
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                            {itemList.map((sentence, index) => (
                              <button
                                key={`fullscreen-sentence-tab-${index}`}
                                onClick={() => handleFullscreenSentenceSelect(index)}
                                className={`p-4 text-center rounded-lg transition-all ${
                                  selectedCluster === index
                                    ? "bg-indigo-100 text-indigo-700 font-medium border-2 border-indigo-200 shadow-md"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent"
                                }`}
                              >
                                <div className="font-bold">Sentence {sentence.sentence_index}</div>
                                <div className="text-sm mt-1">{sentence.tokens.length} terms</div>
                                <div className="text-xs mt-1">
                                  Max: {Math.max(...sentence.tokens.map((t: any) => t.value)).toFixed(3)}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Enhanced ECharts for selected cluster */}
                      {itemList.length > 0 && selectedCluster < itemList.length && itemList[selectedCluster] && (
                        <div id={`fullscreen-chart-${selectedCluster}`} className="bg-white rounded-xl p-6 shadow-lg">
                          <ReactECharts
                            key={`fullscreen-chart-${selectedCluster}`}
                            option={{
                              title: {
                                text: `Sentence ${itemList[selectedCluster]?.sentence_index} - TF-IDF Score Distribution`,
                                left: "center",
                                textStyle: {
                                  fontSize: 18,
                                  fontWeight: "bold",
                                },
                              },
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
                                    <div style="color: #666;">TF-IDF Score: <strong>${data.value.toFixed(4)}</strong></div>
                                  `;
                                },
                              },
                              xAxis: {
                                type: "category",
                                data: itemList[selectedCluster]?.tokens?.map((item: any) => item.word) || [],
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
                                name: "TF-IDF Score",
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
                                  data:
                                    itemList[selectedCluster]?.tokens?.map((item: any) => ({
                                      value: item.value,
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
                                    })) || [],
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
                                top: "15%",
                                containLabel: true,
                              },
                            }}
                            style={{ height: "600px", width: "100%" }}
                          />

                          {/* Enhanced Legend for fullscreen */}
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
                      )}
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

export default ViewTfidfResultPopup;
