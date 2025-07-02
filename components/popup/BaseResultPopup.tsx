import React, { ReactNode } from "react";
import { PipeTaskStateColor } from "@/lib/contant";

// 공통 데이터 타입
export interface BaseResultItem {
  id: number;
  searchKeyword: string;
  searchStartDate: string;
  searchEndDate: string;
  site: string;
  channel: string;
  currentState: string;
  createDate: string;
  startDate?: string;
  endDate?: string;
  count?: number;
  fileSize?: number;
  s3Url?: string;
  description?: string;
}

interface BaseResultPopupProps {
  open: boolean;
  title: string;
  item: BaseResultItem | null;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  hasFullscreen?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const BaseResultPopup: React.FC<BaseResultPopupProps> = ({
  open,
  title,
  item,
  onClose,
  children,
  footer,
  hasFullscreen = false,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  if (!open || !item) return null;

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

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[60] bg-white">
        <div className="h-full flex flex-col">
          {/* Fullscreen Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">{title} - Fullscreen</h2>
                <p className="text-blue-100 text-sm">
                  #{item.id} • {item.searchKeyword}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {onToggleFullscreen && (
                  <button
                    onClick={onToggleFullscreen}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Exit Fullscreen"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Fullscreen Content */}
          <div className="flex-1 overflow-hidden">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">{title}</h2>
              <p className="text-blue-100 text-sm">
                #{item.id} • {item.searchKeyword}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {hasFullscreen && onToggleFullscreen && (
                <button
                  onClick={onToggleFullscreen}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Open in Fullscreen"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 160px)" }}>
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="bg-blue-50 px-6 py-4 border-t flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

export default BaseResultPopup;

// 공통 유틸리티 함수들을 export
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
