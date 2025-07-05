export enum Account {
  EMAIL = "EMAIL",
  GOOGLE = "GOOGLE",
}

export enum Menu {
  Stock = "stock",
  TextMining = "text-mining",
  Settings = "settings",
}

export enum Page {
  LogIn = "log-in",
  SignUp = "sign-up",
  UpdatePassword = "update-pwd",
  Home = "home",
  StockProfit = "profit",
  StockMetrics = "metrics",
  StockNews = "news",
  TextMiningSearch = "search",
  TextMiningClean = "clean",
  TextMiningFrequency = "frequency",
  TextMiningTfidf = "tf-idf",
  TextMiningConcor = "concor",
  TextMiningDashboard = "dashboard", // Add dashboard page
  SettingsProfile = "profile",
  SettingsProject = "project",
  Notfound = "notfound",
}

// Text Mining Constants
export const ITEMS_PER_PAGE = 10;

export enum PipeTaskStatus {
  SEARCH = "SEARCH",
  CLEAN = "CLEAN",
  FREQUENCY = "FREQUENCY",
  TFIDF = "TFIDF",
  CONCOR = "CONCOR",
}

export enum PipeTaskState {
  PREPARING = "preparing",
  PENDING = "pending",
  IN_PROGRESS = "progress",
  COMPLETED = "completed",
}

export const PipeTaskStateColor = {
  [PipeTaskState.PREPARING]: "#6B7280", // 주황색 - 준비 중
  [PipeTaskState.PENDING]: "#F59E0B", // 회색 - 대기 중
  [PipeTaskState.IN_PROGRESS]: "#3B82F6", // 파란색 - 진행 중
  [PipeTaskState.COMPLETED]: "#10B981", // 초록색 - 완료
};

export function getLobbyPage() {
  return Menu.TextMining + "/" + Page.TextMiningDashboard;
}

export const nameRegex = /^[a-zA-Z가-힣0-9\s]{5,}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
