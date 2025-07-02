"use client";
import React, { useState } from "react";
import IconButton from "../button/IconButton";
import { channel } from "diagnostics_channel";
import { parseDateString } from "@/lib/utils";
import { TextminingService } from "@/services/TextminingService";
import { getLobbyPage } from "@/lib/contant";

interface AddNewWorkPopupProps {
  open: boolean;
  onClose: () => void;
}

const siteOptions = ["Naver", "Daum", "Google", "YouTube"];
const channelOptions = [
  {
    name: "Web",
    symbol: "/images/symbol/naver.png",
    key: "naver-web",
  },
  {
    name: "News",
    symbol: "/images/symbol/naver.png",
    key: "naver-news",
  },
  {
    name: "Blog",
    symbol: "/images/symbol/naver.png",
    key: "naver-blog",
  },
];
const cleanOptions = [
  {
    name: "Noun Extraction",
    key: "noun-extraction",
  },
  {
    name: "Adjective Extraction",
    key: "adjective-extraction",
  },
  {
    name: "Verb Extraction",
    key: "verb-extraction",
  },
];
const analysisOptions = [
  {
    name: "Frequency",
    key: "frequency",
  },
  {
    name: "TF-IDF",
    key: "tfidf",
  },
  {
    name: "Concordance",
    key: "concor",
  },
];

const AddNewWorkPopup: React.FC<AddNewWorkPopupProps> = ({ open, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedCleans, setSelectedCleans] = useState<string[]>(cleanOptions.map(opt => opt.key));
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>(analysisOptions.map(opt => opt.key));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleCheckbox = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    setSelected(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value]);
  };

  const handleClose = () => {
    setKeyword("");
    setStartDate("");
    setEndDate("");
    setSelectedChannels([]);
    setSelectedCleans(cleanOptions.map(opt => opt.key));
    setSelectedAnalyses(analysisOptions.map(opt => opt.key));
    onClose();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!keyword.trim()) {
      alert("Please enter a keyword.");
      return;
    }
    if (!startDate) {
      alert("Please select a start date.");
      return;
    }
    if (!endDate) {
      alert("Please select an end date.");
      return;
    }
    if (startDate > endDate) {
      alert("Start Date cannot be after End Date.");
      return;
    }
    if (selectedChannels.length === 0) {
      alert("Please select at least one channel.");
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedStartDate = parseDateString(startDate);
      const parsedEndDate = parseDateString(endDate);

      await new TextminingService().addNewWork(
        keyword,
        parsedStartDate,
        parsedEndDate,
        selectedChannels,
        selectedCleans,
        selectedAnalyses
      );

      handleClose();
      window.location.href = "/" + getLobbyPage();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Add New Task</h2>
                <p className="text-blue-100 text-sm">Create a new text mining task</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 140px)" }}>
          <div className="space-y-6">
            {/* Keyword */}
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-2">
                Keyword *
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="Enter search keyword"
                disabled={isSubmitting}
                maxLength={50}
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Channels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Channels *</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  {channelOptions.map(channel => (
                    <label key={channel.key} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedChannels.includes(channel.key)}
                        onChange={() => handleCheckbox(channel.key, selectedChannels, setSelectedChannels)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <div className="ml-3 flex items-center space-x-2">
                        <img src={channel.symbol} alt={channel.name} className="w-5 h-5 rounded" />
                        <span className="text-sm text-gray-700">{channel.name}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Clean Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Text Cleaning Options</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  {cleanOptions.map(clean => (
                    <label key={clean.key} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCleans.includes(clean.key)}
                        onChange={() => handleCheckbox(clean.key, selectedCleans, setSelectedCleans)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">{clean.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Analysis Options</label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3">
                  {analysisOptions.map(analysis => (
                    <label key={analysis.key} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAnalyses.includes(analysis.key)}
                        onChange={() => handleCheckbox(analysis.key, selectedAnalyses, setSelectedAnalyses)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <span className="ml-2 text-sm text-gray-700">{analysis.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !keyword.trim() || !startDate || !endDate || selectedChannels.length === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewWorkPopup;
