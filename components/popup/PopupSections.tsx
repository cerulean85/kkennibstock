import React from "react";
import DownloadButton from "../button/DownloadButton";
import { BaseResultItem, formatDate, formatFileSize } from "./BaseResultPopup";
import { PipeTaskStateColor } from "@/lib/contant";
import { BulletIconAnalysis, BulletIconResult } from "../icon/BulletIcon";

interface HeaderSectionProps {
  title: string;
  id: number;
  keyword: string;
  onClose: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = (item: HeaderSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">{item.title}</h2>
          <p className="text-blue-100 text-sm">
            #{item.id} • {item.keyword}
          </p>
        </div>
        <button onClick={item.onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface SearchInfoSectionProps {
  item: BaseResultItem;
}

export const SearchInfoSection: React.FC<SearchInfoSectionProps> = ({ item }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search Information
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Search Keyword</label>
          <p className="text-gray-900 font-medium bg-white px-3 py-2 rounded border">{item.searchKeyword}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
            <p className="text-gray-900 text-sm bg-white px-3 py-2 rounded border">
              {formatDate(item.searchStartDate)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">End Date</label>
            <p className="text-gray-900 text-sm bg-white px-3 py-2 rounded border">{formatDate(item.searchEndDate)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Site</label>
            <div className="flex items-center bg-white px-3 py-2 rounded border">
              <img
                src={`/images/symbol/${item.site.toLowerCase()}.png`}
                alt={item.site}
                className="h-5 w-5 mr-2 rounded"
              />
              <span className="text-gray-900 font-medium">{item.site}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Channel</label>
            <p className="text-gray-900 font-medium bg-white px-3 py-2 rounded border uppercase">{item.channel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AnalysisInfoSectionProps {
  analysisType: string;
  analysisDescription: string;
}

export const AnalysisInfoSection: React.FC<AnalysisInfoSectionProps> = (item: AnalysisInfoSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <BulletIconAnalysis />
        Analysis Type
      </h3>
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-3 mr-4">
            <BulletIconAnalysis className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{item.analysisType}</h4>
            <p className="text-gray-600 text-sm">{item.analysisDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DataCountSectionProps {
  count: number;
  description?: string;
  unit: string;
}

export const DataCountSection: React.FC<DataCountSectionProps> = (data: DataCountSectionProps) => {
  if (!data.count) {
    return null;
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">{data.description}</label>
      <p className="text-blue-900 font-bold text-lg bg-white px-3 py-2 rounded border">
        {data.count.toLocaleString()} {data.unit}
      </p>
    </div>
  );
};

interface FileInfoSectionProps {
  url: string | null;
  size: number;
}

export const DownloadResultFileSection = (file: FileInfoSectionProps) => {
  if (!file.url) {
    return null;
  }
  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">File Size</label>
        <p className="text-gray-900 font-medium bg-white px-3 py-2 rounded border">{formatFileSize(file.size)}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Download</label>
        <DownloadButton href={file.url} variant="primary" size="md">
          Download Result File
        </DownloadButton>
      </div>
    </div>
  );
};

interface PreviewSectionProps {
  isShow: boolean;
  handler: () => void;
}

export const PreviewSection = (preview: PreviewSectionProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 mb-1">Data Preview</label>
      <button
        onClick={preview.handler}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors border border-blue-200"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        {preview.isShow ? "Hide Preview" : "Show Data Preview"}
      </button>
    </div>
  );
};

export const ResultInfoTitelSection = () => {
  return (
    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
      <BulletIconResult />
      Result Information
    </h3>
  );
};

interface TaskStatusSectionProps {
  item: BaseResultItem;
}

export const TaskStatusSection: React.FC<TaskStatusSectionProps> = ({ item }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <BulletIconAnalysis />
        Task Status
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Current Status</label>
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
              style={{
                backgroundColor: PipeTaskStateColor[item.currentState as keyof typeof PipeTaskStateColor] + "15",
                color: PipeTaskStateColor[item.currentState as keyof typeof PipeTaskStateColor],
              }}
            >
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{
                  backgroundColor: PipeTaskStateColor[item.currentState as keyof typeof PipeTaskStateColor],
                }}
              ></span>
              {item.currentState}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
            <p className="text-gray-900 text-sm bg-white px-3 py-2 rounded border">{formatDate(item.createDate)}</p>
          </div>
        </div>
        {(item.startDate || item.endDate) && (
          <div className="grid grid-cols-2 gap-3">
            {item.startDate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Start Time</label>
                <p className="text-gray-900 text-sm bg-white px-3 py-2 rounded border">{formatDate(item.startDate)}</p>
              </div>
            )}
            {item.endDate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Completion Time</label>
                <p className="text-gray-900 text-sm bg-white px-3 py-2 rounded border">{formatDate(item.endDate)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface PopupFooterProps {
  item: BaseResultItem;
  onClose: () => void;
}

export const PopupFooter: React.FC<PopupFooterProps> = ({ item, onClose }) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4 text-sm text-gray-500">
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(item.createDate).toLocaleDateString()}
        </span>
        {item.count && item.count > 0 && (
          <span className="flex items-center">
            <BulletIconAnalysis className="w-4 h-4 mr-1" />
            {item.count.toLocaleString()} results
          </span>
        )}
        {item.fileSize && item.fileSize > 0 && (
          <span className="flex items-center">
            <BulletIconResult className="w-4 h-4 mr-1" />
            {formatFileSize(item.fileSize)}
          </span>
        )}
      </div>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
      >
        Close
      </button>
    </div>
  );
};

type AnalysisTitleProps = {
  title: string;
};

export const AnalysisTitle: React.FC<AnalysisTitleProps> = ({ title }) => {
  return (
    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
      <BulletIconAnalysis />
      Frequency Analysis Preview
      <span className="ml-2 text-sm font-normal text-gray-500">(Word frequency distribution)</span>
    </h3>
  );
};
