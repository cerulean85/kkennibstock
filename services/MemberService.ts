import { MemberRepository } from "@/repositories/MemberRepository";

export class MemberService {
	private repo: MemberRepository;

	constructor() {
		this.repo = new MemberRepository();
	}

	async signIn(email: string, password: string, accountType: string) {
		const result: any = await this.repo.signIn(email, password, accountType);		
		if (!result) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('email');
			localStorage.removeItem('accountType');
			return false;			
		}
		console.log('response ======> ');
		console.log(result);

		localStorage.setItem('accessToken', result.accessToken);
		localStorage.setItem('refreshToken', result.refreshToken);			
		localStorage.setItem('email', result.email);			
		localStorage.setItem('accountType', result.accountType);			
		return true;
	}


async signUp(email: string, password: string, accountType: string) {
	let result = await this.repo.signUp(email, password, accountType);
	if (!result) return false;
	return true;
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

	async getGoogleUserEmail(accessToken: string) {
		const userInfo = await fetch(
			'https://www.googleapis.com/oauth2/v3/userinfo',
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		).then(res => res.json());
		if (!userInfo || !userInfo.email) return '';
		return userInfo.email;
	}
}
