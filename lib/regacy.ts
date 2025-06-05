export enum Account { 
	EMAIL = "EMAIL", 
	GOOGLE = "GOOGLE"
}
export enum Page {
	LogIn = "log-in",
	SignUp = "sign-up",
	UpdatePassword = "update-pwd",
	Home = "home",
	Profit = "profit",
	Metrics = "metrics",
	News = "news"
}

export function getLobbyPage() { return Page.Profit; }

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;