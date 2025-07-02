"use client";
import React, { useState, useEffect } from "react";
import { NewsService } from "@/services/NewsService";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Loading from "@/components/Loading";

const News = () => {
  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [feedList, setFeedList] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<string>("");

  const fetchMediaList = async () => {
    setLoading(true);
    try {
      const serv = new NewsService();
      const result = await serv.getRssMediaList();
      setMediaList(result);
    } catch (error) {
      console.error("Error fetching media list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedList = async (mediaName: string) => {
    setLoading(true);
    setSelectedMedia(mediaName);
    try {
      const serv = new NewsService();
      const result = await serv.getRssFeedList(mediaName);
      result.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setFeedList(result);
    } catch (error) {
      console.error("Error fetching feed list:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (selectedMedia) {
      await fetchFeedList(selectedMedia);
    } else {
      await fetchMediaList();
    }
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8 px-2 pt-3 min-h-screen">
      {/* Page Header */}
      <DashboardHeader
        title="Market News"
        description="Stay updated with the latest financial news and market insights"
        onRefresh={refreshData}
      />

      {/* Media Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">News Sources</h3>
        <div className="flex flex-wrap gap-3">
          {mediaList.map((media: any, index: number) => (
            <button
              key={index}
              onClick={() => fetchFeedList(media.idx)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedMedia === media.idx ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {media.name}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Latest Articles</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8">
              <Loading />
            </div>
          ) : feedList.length > 0 ? (
            feedList.map((article: any, index: number) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                    >
                      {article.title}
                    </a>
                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                      <span>📅 {article.updatedAt}</span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-500 text-lg">
                {selectedMedia ? "No articles available for this source" : "Select a news source to view articles"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
