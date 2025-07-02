import React, { useState } from "react";
import IconButton from "../button/IconButton";
import DownloadButton from "../button/DownloadButton";
import { SearchListItem } from "@/model/SearchListItem";
import {
  DataCountSection,
  DownloadResultFileSection,
  HeaderSection,
  PopupFooter,
  ResultInfoTitelSection,
  SearchInfoSection,
  TaskStatusSection,
} from "./PopupSections";

interface ViewSearchResultPopupProps {
  open: boolean;
  item: SearchListItem | null;
  onClose: () => void;
}

const ViewSearchResultPopup: React.FC<ViewSearchResultPopupProps> = ({
  open,
  item,
  onClose,
}: ViewSearchResultPopupProps) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <HeaderSection title="Search Result Details" id={item.id} keyword={item.searchKeyword} onClose={onClose} />

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 160px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SearchInfoSection item={item} />
            </div>

            <div className="space-y-6">
              {/* 결과 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <ResultInfoTitelSection />
                <div className="space-y-3">
                  <DataCountSection count={item.count} description="Collection Count" unit="items" />
                  <DownloadResultFileSection url={item.s3Url} size={item.fileSize} />
                </div>
              </div>

              <TaskStatusSection item={item} />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex-shrink-0">
          <PopupFooter item={item} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ViewSearchResultPopup;
