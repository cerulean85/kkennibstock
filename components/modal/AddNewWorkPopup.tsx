import React, { useState } from "react";
import IconButton from "../button/IconButton";
import { channel } from "diagnostics_channel";
import { parseDateString } from "@/lib/utils";
import { TextminingService } from "@/services/TextminingService";

interface AddNewWorkPopupProps {
  open: boolean;
  onClose: () => void;
}

const siteOptions = ["Naver", "Daum", "Google", "YouTube"];
const channelOptions = [
	{
		name: "Web",
		symbol: "/images/symbol/naver.png",
		key: "naver-web"
	},
	{
		name: "News",
		symbol: "/images/symbol/naver.png",
		key: "naver-news"
	},
	{
		name: "Blog",
		symbol: "/images/symbol/naver.png",
		key: "naver-blog"
	},
];
const cleanOptions = [
  {		
		name: "Noun Extraction",
		key: "noun-extraction"
	},
	{
		name: "Adjective Extraction",
		key: "adjective-extraction"
	},
	{
		name: "Verb Extraction",
		key: "verb-extraction"
	},
];
const analysisOptions = [
	{
		name: "Frequency",
		key: "frequency"
	},
	{
		name: "TF-IDF",
		key: "tfidf"
	},
	{
		name: "CONCOR",
		key: "concor"
	}
];

const AddNewWorkPopup: React.FC<AddNewWorkPopupProps> = ({ open, onClose }) => {
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedCleans, setSelectedCleans] = useState<string[]>(cleanOptions.map(opt => opt.key));
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>(analysisOptions.map(opt => opt.key));

  if (!open) return null;

  const handleCheckbox = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const handleSave = (e: React.FormEvent) => {
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

		const parsedStartDate = parseDateString(startDate)
		const parsedEndDate = parseDateString(endDate)
    console.log({
      keyword,			
      parsedStartDate,
      parsedEndDate,
      selectedChannels,
      selectedCleans,
      selectedAnalyses
    });

		(new TextminingService()).addNewWork(
      keyword,			
      parsedStartDate,
      parsedEndDate,
      selectedChannels,
      selectedCleans,
      selectedAnalyses
    );
    

    alert("Saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[95vh] min-h-[600px] overflow-hidden p-8 relative">
        {/* Title and Close Button Row */}
        <div className="flex items-center justify-between mb-4 pr-8" style={{ minHeight: 32 }}>
          <h2 className="text-2xl font-bold flex items-center h-8 m-0 p-0" style={{ lineHeight: '32px', height: 32 }}>Add New Work</h2>
          <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer">
            <IconButton
              imageSrc="/images/icon/close.svg"
              width={16}
              height={16}
              onClick={onClose}
            />
          </div>
        </div>
        <form className="space-y-4 prose max-w-none overflow-y-auto custom-scrollbar pr-8" style={{ maxHeight: '70vh', minHeight: '350px' }} onSubmit={handleSave}>
          {/* 1. Keyword */}
          <div>
            <label htmlFor="keyword" className="block font-medium mb-1">Keyword</label>
            <input
              id="keyword"
              name="keyword"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter keyword"
              required
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              maxLength={50}
            />
          </div>
          {/* 2. Start Date */}
          <div>
            <label htmlFor="startDate" className="block font-medium mb-1">Start Date</label>
            <div
              className="relative group cursor-pointer"
              tabIndex={0}
              onClick={e => {
                const input = document.getElementById("startDate") as HTMLInputElement | null;
                if (input) {
                  input.focus();
                  if (input.showPicker) input.showPicker();
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  const input = document.getElementById("startDate") as HTMLInputElement | null;
                  if (input) {
                    input.focus();
                    if (input.showPicker) input.showPicker();
                  }
                }
              }}
              style={{ minHeight: 48 }}
            >
              <input
                id="startDate"
                name="startDate"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer text-base bg-transparent"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                lang="en"
                style={{ minHeight: 48 }}
              />
              <span className="absolute inset-0" style={{ pointerEvents: 'none' }}></span>
            </div>
          </div>
          {/* 3. End Date */}
          <div>
            <label htmlFor="endDate" className="block font-medium mb-1">End Date</label>
            <div
              className="relative group cursor-pointer"
              tabIndex={0}
              onClick={e => {
                const input = document.getElementById("endDate") as HTMLInputElement | null;
                if (input) {
                  input.focus();
                  if (input.showPicker) input.showPicker();
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  const input = document.getElementById("endDate") as HTMLInputElement | null;
                  if (input) {
                    input.focus();
                    if (input.showPicker) input.showPicker();
                  }
                }
              }}
              style={{ minHeight: 48 }}
            >
              <input
                id="endDate"
                name="endDate"
                type="date"
                className="w-full border border-gray-300 rounded px-3 py-3 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer text-base bg-transparent"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                lang="en"
                style={{ minHeight: 48 }}
              />
              <span className="absolute inset-0" style={{ pointerEvents: 'none' }}></span>
            </div>
          </div>
          {/* 5. Channel Selection */}
          <div>
            <label className="block font-medium mb-1">Channel</label>
            <div className="flex flex-wrap gap-4">
							{channelOptions.map(({ name, symbol, key }) => (
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedChannels.includes(key)}
                    onChange={() => handleCheckbox(key, selectedChannels, setSelectedChannels)}
                  />
									<div className="flex justify-center items-center text-sm">
										<img src={symbol} className="w-4 h-4 mr-1" />
										{name}
									</div>
                </label>
							))}

            </div>
          </div>
          {/* 6. Clean Method Selection */}
          <div>
            <label className="block font-medium mb-1">Clean Method</label>
            <div className="flex flex-wrap gap-4">
              {cleanOptions.map(({ name, key }) => (
                <label key={key} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    value={key}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
          {/* 7. Analysis Method Selection */}
          <div>
            <label className="block font-medium mb-1">Analysis Method</label>
            <div className="flex flex-wrap gap-4">
              {analysisOptions.map(({ name, key }) => (
                <label key={key} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    value={key}
                  />
                  {name}
                </label>
              ))}
            </div>
          </div>
          {/* 8. Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewWorkPopup;
