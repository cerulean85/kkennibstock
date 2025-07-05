"use client";

import { useState, useEffect } from "react";
import { TextminingService } from "@/services/TextminingService";
import { SearchListItem } from "@/model/SearchListItem";
import { CleanListItem } from "@/model/CleanListItem";
import { FrequencyListItem } from "@/model/FrequencyListItem";
import { TfidfListItem } from "@/model/TfidfListItem";
import { ConcorListItem } from "@/model/ConcorListItem";
import { PipeTaskStateColor, PipeTaskState, PipeTaskStatus } from "@/lib/contant";

export default function TextMiningDashboard() {
  // const [searchList, setSearchList] = useState<SearchListItem[]>([]);
  // const [cleanList, setCleanList] = useState<CleanListItem[]>([]);
  // const [frequencyList, setFrequencyList] = useState<FrequencyListItem[]>([]);
  // const [tfidfList, setTfidfList] = useState<TfidfListItem[]>([]);
  // const [concorList, setConcorList] = useState<ConcorListItem[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
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

      const _dashboardData = await textminingService.getDashboardData();
      console.log("Dashboard Data:", _dashboardData);
      setDashboardData(_dashboardData);

      // const [searchData, cleanData, frequencyData, tfidfData, concorData] = await Promise.all([
      //   textminingService.getSearchList(),
      //   textminingService.getCleanList(),
      //   textminingService.getFrequencyList(),
      //   textminingService.getTfidfList(),
      //   textminingService.getConcorList(),
      // ]);

      // setSearchList(searchData?.list || []);
      // setCleanList(cleanData?.list || []);
      // setFrequencyList(frequencyData?.list || []);
      // setTfidfList(tfidfData?.list || []);
      // setConcorList(concorData?.list || []);
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

  const getTaskStatusMatrix = () => {
    if (!dashboardData || !dashboardData.summaryList) {
      return [];
    }
    const searchSummary = dashboardData?.summaryList.find((summary: any) => summary.status === PipeTaskStatus.SEARCH);
    const cleanSummary = dashboardData?.summaryList.find((summary: any) => summary.status === PipeTaskStatus.CLEAN);
    const frequencySummary = dashboardData?.summaryList.find(
      (summary: any) => summary.status === PipeTaskStatus.FREQUENCY
    );
    const tfidfSummary = dashboardData?.summaryList.find((summary: any) => summary.status === PipeTaskStatus.TFIDF);
    const concorSummary = dashboardData?.summaryList.find((summary: any) => summary.status === PipeTaskStatus.CONCOR);

    const taskData = [
      { name: "Search", data: searchSummary },
      { name: "Clean", data: cleanSummary },
      { name: "Frequency", data: frequencySummary },
      { name: "TF-IDF", data: tfidfSummary },
      { name: "Concordance", data: concorSummary },
    ];

    return taskData.map(task => ({
      taskName: task.name,
      [PipeTaskState.PREPARING]: task.data?.[PipeTaskState.PREPARING] || 0,
      [PipeTaskState.PENDING]: task.data?.[PipeTaskState.PENDING] || 0,
      [PipeTaskState.IN_PROGRESS]: task.data?.[PipeTaskState.IN_PROGRESS] || 0,
      [PipeTaskState.COMPLETED]: task.data?.[PipeTaskState.COMPLETED] || 0,
      total: task.data?.total || 0,
    }));
  };

  return (
    <div className="p-3 sm:p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Text Mining Dashboard</h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">
                Overview of all text mining analysis tasks and their current status
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex flex-col sm:flex-row text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                {lastUpdated && <div>Last updated: {lastUpdated}</div>}
                {autoRefresh && <div>Next refresh: {countdown}s</div>}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleAutoRefresh}
                  className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                    autoRefresh
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }`}
                >
                  Auto: {autoRefresh ? "ON" : "OFF"}
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing || loading}
                  className="flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <svg
                    className={`w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 ${refreshing ? "animate-spin" : ""}`}
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
                    if (!dashboardData || !dashboardData.joinedTaskList) return;
                    const progressData = dashboardData.joinedTaskList || [];
                    return progressData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                          No data available
                        </td>
                      </tr>
                    ) : (
                      progressData.map((item: any, index: number) => (
                        <tr
                          key={`${item.searchKeyword}-${item.site}-${item.channel}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.searchKeyword}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.site}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.channel}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <StatusBadge state={item.searchState} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.cleanStatus !== "-" ? (
                              <StatusBadge state={item.cleanState} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.frequencyStatus !== "-" ? (
                              <StatusBadge state={item.frequencyState} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.tfidfStatus !== "-" ? (
                              <StatusBadge state={item.tfidfState} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {item.concorStatus !== "-" ? (
                              <StatusBadge state={item.concorState} />
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
          </div>
        </div>
      </div>
    </div>
  );
}
