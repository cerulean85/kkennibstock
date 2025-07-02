"use client";

import { useState, useEffect } from "react";
import { TextminingService } from "@/services/TextminingService";
import { SearchListItem } from "@/model/SearchListItem";
import { CleanListItem } from "@/model/CleanListItem";
import { FrequencyListItem } from "@/model/FrequencyListItem";
import { TfidfListItem } from "@/model/TfidfListItem";
import { ConcorListItem } from "@/model/ConcorListItem";
import { PipeTaskStateColor, PipeTaskState } from "@/lib/contant";

export default function TextMiningDashboard() {
  const [searchList, setSearchList] = useState<SearchListItem[]>([]);
  const [cleanList, setCleanList] = useState<CleanListItem[]>([]);
  const [frequencyList, setFrequencyList] = useState<FrequencyListItem[]>([]);
  const [tfidfList, setTfidfList] = useState<TfidfListItem[]>([]);
  const [concorList, setConcorList] = useState<ConcorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const textminingService = new TextminingService();

  useEffect(() => {
    loadAllData();
  }, []);

  // Auto refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (autoRefresh) {
      // Countdown effect
      countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 30; // Reset countdown
          }
          return prev - 1;
        });
      }, 1000);

      // Auto refresh effect
      interval = setInterval(() => {
        if (!refreshing && !loading) {
          handleRefresh();
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [autoRefresh, refreshing, loading]);

  // Reset countdown when refresh happens
  useEffect(() => {
    if (refreshing) {
      setCountdown(30);
    }
  }, [refreshing]);

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [searchData, cleanData, frequencyData, tfidfData, concorData] = await Promise.all([
        textminingService.getSearchList(),
        textminingService.getCleanList(),
        textminingService.getFrequencyList(),
        textminingService.getTfidfList(),
        textminingService.getConcorList(),
      ]);

      setSearchList(searchData?.list || []);
      setCleanList(cleanData?.list || []);
      setFrequencyList(frequencyData?.list || []);
      setTfidfList(tfidfData?.list || []);
      setConcorList(concorData?.list || []);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setCountdown(30); // Reset countdown on manual refresh
      await loadAllData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      setCountdown(30); // Reset countdown when enabling auto refresh
    }
  };

  const getStateColor = (state: string) => {
    return PipeTaskStateColor[state as keyof typeof PipeTaskStateColor] || "#6B7280";
  };

  const StatusBadge = ({ state }: { state: string }) => (
    <span
      className="px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: getStateColor(state) }}
    >
      {state}
    </span>
  );

  const getAnalysisProgressTable = () => {
    // Get unique combinations of keyword, site, channel from search data
    const searchItems = searchList.map(item => ({
      keyword: item.searchKeyword,
      site: item.site,
      channel: item.channel,
      searchStatus: item.currentState,
      searchId: item.id,
    }));

    // Create progress table by matching search items with other analysis types
    const allData = searchItems.map(searchItem => {
      // Find corresponding items in other analysis types based on keyword/site/channel
      const cleanItem = cleanList.find(
        item =>
          item.searchKeyword === searchItem.keyword &&
          item.site === searchItem.site &&
          item.channel === searchItem.channel
      );

      const frequencyItem = frequencyList.find(
        item =>
          item.searchKeyword === searchItem.keyword &&
          item.site === searchItem.site &&
          item.channel === searchItem.channel
      );

      const tfidfItem = tfidfList.find(
        item =>
          item.searchKeyword === searchItem.keyword &&
          item.site === searchItem.site &&
          item.channel === searchItem.channel
      );

      const concorItem = concorList.find(
        item =>
          item.searchKeyword === searchItem.keyword &&
          item.site === searchItem.site &&
          item.channel === searchItem.channel
      );

      return {
        keyword: searchItem.keyword,
        site: searchItem.site,
        channel: searchItem.channel,
        searchStatus: searchItem.searchStatus,
        cleanStatus: cleanItem?.currentState || "-",
        frequencyStatus: frequencyItem?.currentState || "-",
        tfidfStatus: tfidfItem?.currentState || "-",
        concorStatus: concorItem?.currentState || "-",
      };
    });

    // Pagination
    const totalPages = Math.ceil(allData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = allData.slice(startIndex, startIndex + itemsPerPage);

    return {
      data: paginatedData,
      totalPages,
      totalItems: allData.length,
    };
  };

  const getTaskStatusMatrix = () => {
    const taskData = [
      { name: "Search", data: searchList },
      { name: "Clean", data: cleanList },
      { name: "Frequency", data: frequencyList },
      { name: "TF-IDF", data: tfidfList },
      { name: "Concordance", data: concorList },
    ];

    return taskData.map(task => {
      const statusCounts = {
        [PipeTaskState.PREPARING]: 0,
        [PipeTaskState.PENDING]: 0,
        [PipeTaskState.IN_PROGRESS]: 0,
        [PipeTaskState.COMPLETED]: 0,
      };

      task.data.forEach(item => {
        const status = item.currentState;
        if (statusCounts.hasOwnProperty(status)) {
          statusCounts[status]++;
        }
      });

      return {
        taskName: task.name,
        ...statusCounts,
        total: task.data.length,
      };
    });
  };

  const StatusSummaryCard = ({ status, count }: { status: string; count: number }) => (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ backgroundColor: getStateColor(status) }}></div>
      <div className="text-2xl font-bold text-gray-900">{count}</div>
      <div className="text-sm text-gray-600">{status}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const TableSection = ({ title, data, type }: { title: string; data: any[]; type: string }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keyword
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No data available for {title}
                  </td>
                </tr>
              ) : (
                data.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.searchKeyword}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.site}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.channel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge state={item.currentState} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.createDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TableSection title="Search Tasks" data={searchList} type="search" />
        <TableSection title="Clean Tasks" data={cleanList} type="clean" />
        <TableSection title="Frequency Analysis" data={frequencyList} type="frequency" />
        <TableSection title="TF-IDF Analysis" data={tfidfList} type="tfidf" />
        <TableSection title="Concordance Analysis" data={concorList} type="concor" />
      </div>
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Text Mining Dashboard</h1>
              <p className="mt-2 text-gray-600">Overview of all text mining analysis tasks and their current status</p>
            </div>
            <div className="flex items-center space-x-4">
              {lastUpdated && <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>}
              {autoRefresh && <div className="text-sm text-gray-500">Next refresh: {countdown}s</div>}
              <button
                onClick={toggleAutoRefresh}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  autoRefresh
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                Auto refresh: {autoRefresh ? "ON" : "OFF"}
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing || loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Task-Status Matrix */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Status Summary</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Task Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preparing
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getTaskStatusMatrix().map(task => (
                    <tr key={task.taskName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.taskName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getStateColor(PipeTaskState.PREPARING) }}
                        >
                          {task[PipeTaskState.PREPARING]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getStateColor(PipeTaskState.PENDING) }}
                        >
                          {task[PipeTaskState.PENDING]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getStateColor(PipeTaskState.IN_PROGRESS) }}
                        >
                          {task[PipeTaskState.IN_PROGRESS]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getStateColor(PipeTaskState.COMPLETED) }}
                        >
                          {task[PipeTaskState.COMPLETED]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-gray-900">
                        {task.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analysis Progress Table */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Analysis Progress by Keyword</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Search
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clean
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TF-IDF
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Concordance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    const progressData = getAnalysisProgressTable();
                    return progressData.data.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      progressData.data.map((item, index) => (
                        <tr key={`${item.keyword}-${item.site}-${item.channel}-${index}`} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keyword}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.site}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.channel}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <StatusBadge state={item.searchStatus} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.cleanStatus !== "-" ? (
                              <StatusBadge state={item.cleanStatus} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.frequencyStatus !== "-" ? (
                              <StatusBadge state={item.frequencyStatus} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.tfidfStatus !== "-" ? (
                              <StatusBadge state={item.tfidfStatus} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.concorStatus !== "-" ? (
                              <StatusBadge state={item.concorStatus} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    );
                  })()}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(() => {
              const progressData = getAnalysisProgressTable();
              if (progressData.totalPages > 1) {
                return (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(progressData.totalPages, prev + 1))}
                        disabled={currentPage === progressData.totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(currentPage * itemsPerPage, progressData.totalItems)}
                          </span>{" "}
                          of <span className="font-medium">{progressData.totalItems}</span> results
                        </p>
                      </div>
                      <div>
                        <nav
                          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                          aria-label="Pagination"
                        >
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>

                          {Array.from({ length: progressData.totalPages }, (_, i) => i + 1).map(pageNumber => (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          ))}

                          <button
                            onClick={() => setCurrentPage(prev => Math.min(progressData.totalPages, prev + 1))}
                            disabled={currentPage === progressData.totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
