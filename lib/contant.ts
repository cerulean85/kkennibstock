export enum Account { 
	EMAIL = "EMAIL", 
	GOOGLE = "GOOGLE"
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
	StockSnapshot = "snapshot",
	StockNews = "news",
	TextMiningSearch = "search",
	TextMiningFrequency = "frequency",
	TextMiningTfidf = "tf-idf",
	TextMiningConcor = "concor",
	SettingsProfile = "profile",
	Notfound = "notfound",
}

export enum PipeTaskState {
  PREPARING = "preparing",
  PENDING = "pending",
  IN_PROGRESS = "progress",
  COMPLETED = "completed"
}

export enum PipeTaskStatus {
    SEARCH = "search",
    CLEAN = "clean",
    FREQUENCY = "frequency",
    TFIDF = "tfidf",
    CONCOR = "concor"
}


export function getLobbyPage() { 
	// alert("getLobbyPage called");
	return Menu.Stock + '/' + Page.StockProfit;
}

export const nameRegex = /^[a-zA-Z가-힣0-9\s-_]{5,}$/;
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;