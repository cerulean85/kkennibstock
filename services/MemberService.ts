import { MemberRepository } from "@/repositories/MemberRepository";
import { BaseService } from "./BaseService";

export class MemberService extends BaseService {

	
	private repo: MemberRepository;

	constructor() {
		super();
		this.repo = new MemberRepository();
	}

	async sendPasswordResetLink(email: string) {
		const response: any = await this.repo.sendPasswordResetLink(email);		
		const result = this.getData(response);
		return result;
	}

	async logIn(email: string, password: string, accountType: string) {
		const response: any = await this.repo.logIn(email, password, accountType);		
		const resut = this.getData(response);
		if (!resut) {
			this.logOut();
			alert("Login failed.");
			return false;			
		}
		localStorage.setItem('accessToken', resut.accessToken);
		localStorage.setItem('refreshToken', resut.refreshToken);			
		localStorage.setItem('email', resut.email);			
		localStorage.setItem('accountType', resut.accountType);			
		localStorage.setItem('name', resut.name);		
		localStorage.setItem('picture', resut.picture);			
		
		return true;
	}


	async signUp(email: string, password: string, accountType: string, name: string, profileImage: string = '') {
		const result = await this.repo.signUp(email, password, accountType, name, profileImage);
		return this.getData(result);
	}

	async logOut() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('email');
		localStorage.removeItem('accountType');
		localStorage.removeItem('name');
		localStorage.removeItem('picture');
		return true;
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
		if (!userInfo || !userInfo.email) {
			alert("Email not found.");
			return null;
		}
		return userInfo;
	}

	async checkResetToken(token: string) {
		const response: any = await this.repo.checkResetToken(token);
		const result = this.getData(response);
		return result;
	}

	async updatePassword(token: string, password: string) {
		const response: any = await this.repo.updatePassword(token, password);
		const result = this.getData(response);
		return result;
	}

	async	updateName(email: string, name: string) {
		const response: any = await this.repo.updateName(email, name);
		const result = this.getData(response);
		return result;
	}

	async sendContactUs(
		name: string,
		email: string,
		message: string
	) {
		const response: any = await this.repo.sendContactUs(name, email, message);
		const result = this.getData(response);
		return result;
	}
}
