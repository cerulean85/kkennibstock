export enum ViewMode {
  LIST = "list",
  CHART = "chart",
  NETWORK = "network",
}

interface PreviewSelectionButtonProps {
  currentViewMode: string;
  targetViewMode: ViewMode;
  selector: (viewMode: ViewMode) => void;
}

const changeUpperCaseOnlyFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const PreviewSelectionButton: React.FC<PreviewSelectionButtonProps> = ({
  currentViewMode,
  targetViewMode,
  selector,
}: PreviewSelectionButtonProps) => {
  return (
    <button
      onClick={() => selector(targetViewMode)}
      className={`px-3 py-1 text-sm rounded transition-colors ${
        currentViewMode === targetViewMode
          ? "bg-blue-100 text-blue-700 font-medium"
          : "text-gray-600 hover:text-gray-800"
      }`}
    >
      <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      {changeUpperCaseOnlyFirst(targetViewMode)}
    </button>
  );
};

interface ViewFullScreenButtonProps {
  toggleFullscreen: (isFull: boolean) => void;
}

export const ViewFullScreenButton: React.FC<ViewFullScreenButtonProps> = ({
  toggleFullscreen,
}: ViewFullScreenButtonProps) => {
  return (
    <button
      onClick={() => toggleFullscreen(true)}
      className="flex items-center px-3 py-1 text-sm bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-lg transition-colors"
      title="View in Fullscreen"
    >
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
        />
      </svg>
      Fullscreen
    </button>
  );
};
