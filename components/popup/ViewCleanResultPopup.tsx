import React, { useEffect, useState } from "react";
import { CleanListItem } from "@/model/CleanListItem";
import { TextminingService } from "@/services/TextminingService";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  DataCountSection,
  DownloadResultFileSection,
  HeaderSection,
  PopupFooter,
  PreviewSection,
  ResultInfoTitelSection,
  SearchInfoSection,
  TaskStatusSection,
} from "./PopupSections";
import { ViewFullScreenButton } from "../button/PopupButton";
import { BulletIconResult } from "../icon/BulletIcon";

interface ViewCleanResultPopupProps {
  open: boolean;
  item: CleanListItem | null;
  onClose: () => void;
}

const ViewCleanResultPopup: React.FC<ViewCleanResultPopupProps> = ({
  open,
  item,
  onClose,
}: ViewCleanResultPopupProps) => {
  if (!open || !item) return null;

  const [showPreview, setShowPreview] = useState(false);
  const [itemList, setItemList] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const fetchData = async (taskId: number, page: number = 1, isInitial: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const serv = new TextminingService();
      const _cleanData = await serv.getCleanData(taskId, page);
      console.log("Fetched clean data:", _cleanData);

      if (isInitial) {
        setItemList(_cleanData.list || []);
        setCurrentCount(_cleanData.itemCount || 0);
        setPageNo(2); // Next page to fetch
      } else {
        setItemList(prev => [...prev, ...(_cleanData.list || [])]);
        setCurrentCount(prev => prev + (_cleanData.itemCount || 0));
        setPageNo(prev => prev + 1);
      }

      setTotalCount(_cleanData.totalCount || 0);
      setHasMore(
        (_cleanData.itemCount || 0) > 0 && currentCount + (_cleanData.itemCount || 0) < (_cleanData.totalCount || 0)
      );
    } catch (error) {
      console.error("Error fetching clean data:", error);
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
        <HeaderSection title="Clean Result Details" id={item.id} keyword={item.searchKeyword} onClose={onClose} />

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 160px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SearchInfoSection item={item} />

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  Extraction Options
                </h3>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Extract Parts of Speech</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center bg-white px-3 py-2 rounded border">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${item.extractNoun ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span className={`text-sm font-medium ${item.extractNoun ? "text-green-700" : "text-gray-500"}`}>
                        Noun
                      </span>
                    </div>
                    <div className="flex items-center bg-white px-3 py-2 rounded border">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${item.extractVerb ? "bg-blue-500" : "bg-gray-300"}`}
                      ></div>
                      <span className={`text-sm font-medium ${item.extractVerb ? "text-blue-700" : "text-gray-500"}`}>
                        Verb
                      </span>
                    </div>
                    <div className="flex items-center bg-white px-3 py-2 rounded border">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${item.extractAdjective ? "bg-purple-500" : "bg-gray-300"}`}
                      ></div>
                      <span
                        className={`text-sm font-medium ${item.extractAdjective ? "text-purple-700" : "text-gray-500"}`}
                      >
                        Adjective
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 상태 및 결과 */}
            <div className="space-y-6">
              {/* 결과 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <ResultInfoTitelSection />
                <div className="space-y-3">
                  <DataCountSection count={item.count} description="Cleaned Count" unit="items" />
                  <DownloadResultFileSection url={item.s3Url} size={item.fileSize} />
                  <PreviewSection isShow={showPreview} handler={handleShowPreview} />
                </div>
              </div>
              <TaskStatusSection item={item} />
            </div>
          </div>

          {/* Data Preview Section */}
          {showPreview && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BulletIconResult />
                  Data Preview
                  <span className="ml-2 text-sm font-normal text-gray-500">(Interactive preview of cleaned data)</span>
                </h3>
                <div className="flex items-center space-x-3">
                  {totalCount > 0 && (
                    <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-lg border">
                      Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} items
                    </div>
                  )}
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
                <div id="scrollableDiv" className="bg-white rounded-lg border max-h-96 overflow-auto">
                  <InfiniteScroll
                    dataLength={itemList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                      <div className="flex items-center justify-center py-4">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
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
                          <p className="text-sm text-gray-400">{totalCount.toLocaleString()} items total</p>
                        </div>
                      </div>
                    }
                    scrollableTarget="scrollableDiv"
                    className="divide-y divide-gray-100"
                  >
                    {itemList.map((sentence, index) => (
                      <div
                        key={`sentence-${sentence.sentence_index}-${index}`}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center">
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full mr-2">
                              #{sentence.sentence_index + 1}
                            </span>
                            Sentence {sentence.sentence_index + 1}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {sentence.tokens.length} tokens
                            </span>
                            <span className="text-xs text-gray-400">Item {index + 1}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {sentence.tokens.map((token: any, tokenIndex: any) => {
                            const getTokenColor = (pos: string) => {
                              switch (pos) {
                                case "Noun":
                                  return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
                                case "Verb":
                                  return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
                                case "Adjective":
                                  return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
                                default:
                                  return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
                              }
                            };

                            return (
                              <div
                                key={`token-${sentence.sentence_index}-${tokenIndex}`}
                                className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border transition-colors cursor-default ${getTokenColor(token.pos)}`}
                                title={`Word: ${token.word} | Part of Speech: ${token.pos}`}
                              >
                                <span className="mr-1">{token.word}</span>
                                <span className="text-xs opacity-75">({token.pos})</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </InfiniteScroll>
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
                    <p className="font-medium mb-1">Interactive Data Preview</p>
                    <p>
                      Scroll down to load more data automatically. Each sentence shows tokenized words with their parts
                      of speech (POS) tags. Colors represent:{" "}
                      <span className="font-medium text-green-700">Green = Nouns</span>,
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
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BulletIconResult className="w-6 h-6 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Data Preview - Full Screen</h2>
                  <p className="text-indigo-200 text-sm">
                    #{item.id} • {item.searchKeyword}
                    {totalCount > 0 && (
                      <span className="ml-4">
                        Showing {currentCount.toLocaleString()} of {totalCount.toLocaleString()} items
                      </span>
                    )}
                  </p>
                </div>
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
              <div
                id="fullscreenScrollableDiv"
                className="h-full overflow-auto bg-gray-50 p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#D1D5DB #F3F4F6",
                }}
              >
                <InfiniteScroll
                  dataLength={itemList.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
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
                        <p className="text-gray-400">{totalCount.toLocaleString()} items total</p>
                      </div>
                    </div>
                  }
                  scrollableTarget="fullscreenScrollableDiv"
                  className="space-y-4"
                >
                  {itemList.map((sentence, index) => (
                    <div
                      key={`fullscreen-sentence-${sentence.sentence_index}-${index}`}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mr-3">
                            #{sentence.sentence_index + 1}
                          </span>
                          Sentence {sentence.sentence_index + 1}
                        </h4>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {sentence.tokens.length} tokens
                          </span>
                          <span className="text-sm text-gray-400">Item {index + 1}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {sentence.tokens.map((token: any, tokenIndex: any) => {
                          const getTokenColor = (pos: string) => {
                            switch (pos) {
                              case "Noun":
                                return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
                              case "Verb":
                                return "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
                              case "Adjective":
                                return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
                              default:
                                return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
                            }
                          };

                          return (
                            <div
                              key={`fullscreen-token-${sentence.sentence_index}-${tokenIndex}`}
                              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border transition-colors cursor-default shadow-sm ${getTokenColor(token.pos)}`}
                              title={`Word: ${token.word} | Part of Speech: ${token.pos}`}
                            >
                              <span className="mr-2 font-semibold">{token.word}</span>
                              <span className="text-sm opacity-75">({token.pos})</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCleanResultPopup;
