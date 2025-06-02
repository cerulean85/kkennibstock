import { UserRepository } from "@/repositories/UserRepository";

export class UserService {
	private repo: UserRepository;

	constructor() {
		this.repo = new UserRepository();
	}

	async login(userId: string, password: string): Promise<{}> {
		const response: any = await this.repo.login(userId, password);		
		if (!response) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('userSeqId');
			localStorage.removeItem('isAdmin');
			return false;			
		}
		console.log('response ======> ');
		console.log(response);
		const status = response.status;
		const data = response.data;
		if (status.isSuccess) {
			if (data.userSeqId > 0) {
				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken);			
				localStorage.setItem('userSeqId', data.userSeqId);			
				localStorage.setItem('isAdmin', (data.userSeqId === 1 || userId === 'admin') ? 'Y' : 'N');			
				return true;
			}
		}
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('userSeqId');
		localStorage.removeItem('isAdmin');
		return false;
	}


async signUp(
	userId: string,
	password: string,
	email: string,
	name: string,
	affiliation: string,
	phoneNumber: string
) {
	const result: any = await this.repo.signUp(
		userId, 
		password,
		email,
		name,
		affiliation,
		phoneNumber
	);

	console.log('result ======> ');
	console.log(result);
	if (result.status.isSuccess) {
		if (result.data.userSeqId > 0) {
			alert('회원가입이 완료되었습니다. 로그인 해주세요.');
			return true;
		}
	}
	alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
	return false;
}

	async logout() {
		const userSeqIdVar: string | null = localStorage.getItem('userSeqId');
		const refreshToken: string | null = localStorage.getItem('refreshToken');
		if (refreshToken && userSeqIdVar && userSeqIdVar !== '') {
			const userSeqId = Number(userSeqIdVar);			
			if (userSeqId > 0) {
				const result = await this.repo.logout(userSeqId, refreshToken);
				if (result.status.isSuccess && result.data.isSuccess) {
					localStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					localStorage.removeItem('userSeqId');
					localStorage.removeItem('isAdmin');
					return true;
				} else {
					alert(result.status.message);
					return false;
				}
			}
		}
		alert('로그아웃 중 오류가 발생하였습니다.');
		return false;
	}

	async findUserId(emailOrPhoneNumber: string): Promise<{}> {
		const result: any = await this.repo.findUserId(emailOrPhoneNumber);
		const status = result.status;
		const data = result.data;
		if (!status.isSuccess) {
			return '';
		} else {
			if (!data || data.userId === '') {
				return '';
			} else {
				return data.userId;
			}
		}
	}
	async findUserInfo(userSeqId: number): Promise<{}> {
		const result: any = await this.repo.findUserInfo(userSeqId);
		const status = result.status;
		const data = result.data;
		if (!status.isSuccess || data.userSeqId < 1) {
			alert('회원 정보를 조회할 수 없습니다.');		
		}
		return data;
	}

	async updateUserInfo(userSeqId: number, name: string, org: string, phone: string, email: string): Promise<{}> {
		return await this.repo.updateUserInfo(userSeqId, name, org, phone, email);
	}

	async validatePassword(userSeqId: number, pwd: string): Promise<{}> {
		const result: any = await this.repo.validatePassword(userSeqId, pwd);	
		const status = result.status;
		const data = result.data;
		if (!status.isSuccess) {
			alert(status.message);		
			return false;
		} else {
	
			if (data.isSuccess) {
				return true;
			} else {
				alert('비밀번호가 잘못되었습니다.');
				return false;
			}
		}
	}

	async updatePwd(userSeqId: number, pwd: string) {
		try {
			const response: any = await this.repo.updatePwd(userSeqId, pwd);
			if (!response.status.isSuccess || !response.data.isSuccess) {
				alert(response.status.message);		
				return false;
			} else {
				alert(response.data.isSuccess ? '비밀번호가 변경되었습니다.' : '비밀번호 변경에 실패하였습니다.');
				return response.data.isSuccess;				
			}
		} catch {
			return false;
		}
	}

	async getUserList(startDate: string, endDate: string, keyword: string, page: number, limit: number) {
		const response = await this.repo.getUserList(startDate, endDate, keyword, page, limit);
		const isSuccess = response.status.isSuccess;
		const result = {
			data: isSuccess ? response.data.data : [],
			total: isSuccess ? response.data.total : 0 
		};
		if (!response.status.isSuccess)
			alert(response.status.message);			
		return result;
	}

	async getLoginHistoryList(startDate: string, endDate: string, keyword: string, page: number, limit: number) {
		const response = await this.repo.getLoginHistoryList(startDate, endDate, keyword, page, limit);
		const isSuccess = response.status.isSuccess;
		const result = {
			data: isSuccess ? response.data.data : [],
			total: isSuccess ? response.data.total : 0 
		};
		if (!response.status.isSuccess)
			alert(response.status.message);			
		return result;
	}

	async checkDuplicedUserId(userId: string) {
		const result = await this.repo.checkDuplicedUserId(userId);
		const status = result.status;
		const data = result.data;
		console.log(result)
		if (status.isSuccess) {
			return data.exist;
		} else {
			alert('알 수 없는 오류가 발생하였습니다.');
			return false;
		}
	}
}
