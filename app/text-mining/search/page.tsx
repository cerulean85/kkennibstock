'use client'
import Loading from '@/components/Loading';
import { PipeTaskState } from '@/lib/contant';
import { SearchListItem, TextminingService } from '@/services/TextminingService';
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from 'recharts';

// 일관된 컬러 시스템
const COLORS = {
  preparing: '#3b82f6',  // blue-500
  pending: '#f59e0b',    // amber-500  
  progress: '#10b981',   // emerald-500
  completed: '#22c55e'   // green-500
};

const CHART_COLORS = [COLORS.preparing, COLORS.pending, COLORS.progress, COLORS.completed];

const ITEMS_PER_PAGE = 10;

const SearchPage = () => {
  const [searchList, setSearchList] = useState<SearchListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [preparingCount, setPreparingCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);    // 검색 필터 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSite, setFilterSite] = useState('all');
  const [filterActions, setFilterActions] = useState('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  
  // 정렬 상태
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = () => {
    setLoading(true);
    setTimeout(() => {
      (new TextminingService).getSearchList().then((res) => {
        console.log("Search List: ", res);
        setSearchList(res.list);
        setPreparingCount(res.count[PipeTaskState.PREPARING] || 0);
        setPendingCount(res.count[PipeTaskState.PENDING] || 0);
        setProgressCount(res.count[PipeTaskState.IN_PROGRESS] || 0);
        setCompletedCount(res.count[PipeTaskState.COMPLETED] || 0);
        setLoading(false);
      }).catch((err) => {
        console.error("Error fetching search list: ", err);
        setLoading(false);
      });
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    { name: 'Preparing', value: preparingCount },
    { name: 'Pending', value: pendingCount },
    { name: 'In Progress', value: progressCount },
    { name: 'Completed', value: completedCount },
  ];
  // 총계 및 완료율
  const totalTasks = preparingCount + pendingCount + progressCount + completedCount;
  const completionRate = totalTasks > 0 ? ((completedCount / totalTasks) * 100).toFixed(1) : '0.0';
  // 사용 가능한 사이트 목록
  const availableSites = useMemo(() => {
    const sites = Array.from(new Set(searchList.map(item => item.site)));
    return sites.sort();
  }, [searchList]);

  // 사용 가능한 액션 목록
  const availableActions = useMemo(() => {
    const actions = Array.from(new Set(searchList.map(item => item.s3Url ? 'download' : 'processing')));
    return actions.sort();
  }, [searchList]);  // 필터링 및 정렬된 데이터
  const filteredData = useMemo(() => {
    return searchList.filter(item => {
      // 키워드 필터링
      if (searchKeyword && !item.searchKeyword.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      
      // 상태 필터링
      if (filterStatus !== 'all' && item.currentState !== filterStatus) {
        return false;
      }
      
      // SITE 필터링
      if (filterSite !== 'all' && item.site.toLowerCase() !== filterSite.toLowerCase()) {
        return false;
      }
      
      // ACTIONS 필터링
      if (filterActions !== 'all') {
        const itemAction = item.s3Url ? 'download' : 'processing';
        if (itemAction !== filterActions) {
          return false;
        }
      }
      
      // 날짜 필터링
      if (startDateFilter && item.searchStartDate < startDateFilter) {
        return false;
      }
      
      if (endDateFilter && item.searchEndDate > endDateFilter) {
        return false;
      }
      
      return true;
    }).sort((a, b) => {
      // 정렬
      let aValue = a[sortField as keyof SearchListItem];
      let bValue = b[sortField as keyof SearchListItem];
      
      // ACTIONS 필드에 대한 특별 처리
      if (sortField === 'actions') {
        aValue = a.s3Url ? 'download' : 'processing';
        bValue = b.s3Url ? 'download' : 'processing';
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' ? 
        (aValue as number) - (bValue as number) : 
        (bValue as number) - (aValue as number);
    });
  }, [searchList, searchKeyword, filterStatus, filterSite, filterActions, sortField, sortDirection, startDateFilter, endDateFilter]);

  // 페이지네이션 데이터
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const pageCount = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // 정렬 토글 핸들러
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIndicator = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '▲' : '▼';
  };  return (
    <div className="space-y-8 px-2 pt-3 min-h-screen">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Search Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your text mining tasks</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{progressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Task Status Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Distribution</h3>            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Cards */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Status Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              {chartData.map((item, idx) => (
                <div
                  key={item.name}
                  className="bg-gray-50 rounded-lg p-4 border-l-4"
                  style={{ borderLeftColor: CHART_COLORS[idx] }}
                >
                  <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">{item.name}</div>
                  <div className="text-2xl font-bold mt-1" style={{ color: CHART_COLORS[idx] }}>
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>      {/* Task List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Task Management</h2>
          <p className="text-sm text-gray-600 mt-1">Filter and manage your text mining tasks</p>
        </div>          {/* 필터 영역 */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <label htmlFor="keyword-filter" className="block text-sm font-medium text-gray-700 mb-2">Search Keyword</label>
              <input
                id="keyword-filter"
                type="text"
                className="block w-full border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Filter by keyword..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                id="status-filter"
                className="block w-full border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="preparing">Preparing</option>
                <option value="pending">Pending</option>
                <option value="progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="site-filter" className="block text-sm font-medium text-gray-700 mb-2">Site</label>
              <select
                id="site-filter"
                className="block w-full border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterSite}
                onChange={(e) => setFilterSite(e.target.value)}
              >
                <option value="all">All Sites</option>
                {availableSites.map(site => (
                  <option key={site} value={site}>{site}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="actions-filter" className="block text-sm font-medium text-gray-700 mb-2">Actions</label>
              <select
                id="actions-filter"
                className="block w-full border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterActions}
                onChange={(e) => setFilterActions(e.target.value)}
              >
                <option value="all">All Actions</option>
                <option value="download">Download Available</option>
                <option value="processing">Processing</option>
              </select>
            </div>
            <div>
              <label htmlFor="start-date-filter" className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                id="start-date-filter"
                type="date"
                className="block w-full border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="end-date-filter" className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                id="end-date-filter"
                type="date"
                className="block w-full border-gray-300 rounded-lg shadow-sm text-sm px-3 py-2 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredData.length} of {searchList.length} tasks
            </div>            <button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={() => {
                setSearchKeyword('');
                setFilterStatus('all');
                setFilterSite('all');
                setFilterActions('all');
                setStartDateFilter('');
                setEndDateFilter('');
                setSortField('id');
                setSortDirection('desc');
                setCurrentPage(1);
              }}
            >
              Clear Filters            </button>
          </div>
        </div>
        
        {/* 테이블 영역 */}
        <div className="overflow-hidden">
          {filteredData.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-2 text-gray-500">No tasks match your current filters. Try adjusting your search criteria.</p>              <button 
                onClick={() => {
                  setSearchKeyword('');
                  setFilterStatus('all');
                  setFilterSite('all');
                  setFilterActions('all');
                  setStartDateFilter('');
                  setEndDateFilter('');
                  setCurrentPage(1);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>ID</span>
                          <span className="text-gray-400">{renderSortIndicator('id')}</span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('searchKeyword')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Keyword</span>
                          <span className="text-gray-400">{renderSortIndicator('searchKeyword')}</span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('searchStartDate')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Start Date</span>
                          <span className="text-gray-400">{renderSortIndicator('searchStartDate')}</span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('searchEndDate')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>End Date</span>
                          <span className="text-gray-400">{renderSortIndicator('searchEndDate')}</span>
                        </div>
                      </th>                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('site')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Site</span>
                          <span className="text-gray-400">{renderSortIndicator('site')}</span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Channel
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('currentState')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          <span className="text-gray-400">{renderSortIndicator('currentState')}</span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('createDate')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Created</span>
                          <span className="text-gray-400">{renderSortIndicator('createDate')}</span>
                        </div>
                      </th>                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('actions')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Actions</span>
                          <span className="text-gray-400">{renderSortIndicator('actions')}</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.searchKeyword}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.searchStartDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.searchEndDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <img 
                              src={`/images/symbol/${item.site.toLowerCase()}.png`} 
                              alt={item.site} 
                              className="h-5 w-5 mr-2 rounded" 
                            />
                            {item.site}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="font-medium">{item.channel.toUpperCase()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                            style={{
                              backgroundColor: COLORS[item.currentState as keyof typeof COLORS] + '15', 
                              color: COLORS[item.currentState as keyof typeof COLORS]
                            }}
                          >
                            {item.currentState}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.createDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.s3Url ? (
                            <a
                              href={item.s3Url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600"
                              title="Download results"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </a>
                          ) : (
                            <div className="inline-flex items-center justify-center w-8 h-8">
                              <Loading width={16} height={16} />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}</span> of{' '}
                  <span className="font-medium">{filteredData.length}</span> results
                </div>
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="hidden md:flex space-x-1">
                    {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                      let pageNum;
                      if (pageCount <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pageCount - 2) {
                        pageNum = pageCount - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount))}
                    disabled={currentPage === pageCount}
                    className="relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
