import React from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  loading?: boolean;
  refreshCountdown?: number;
  onRefresh: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  description,
  loading = false,
  refreshCountdown = -999,
  onRefresh,
}: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-4">
        {refreshCountdown >= 0 && (
          <span className="text-sm text-gray-500">Refreshing in {refreshCountdown} seconds...</span>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-2 rounded-xl font-bold text-base shadow-md hover:from-blue-900 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
