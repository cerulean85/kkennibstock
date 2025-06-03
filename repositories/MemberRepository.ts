import { fetchGet, fetchPatch, fetchPost, fetchPut } from "./req"

export class MemberRepository {
	async signIn(email: string, password: string, accountType: string): Promise<any[]> {
		const res: any = await fetchPost('member/signin', {
			'email': email,
      'password': password,      
			"accountType": accountType
		});
		return res;
	}

	async signUp(email: string, password: string, accountType: string) {
		const res: any = await fetchPost('member/signup', {
			'email': email,
      'password': password,      
			"accountType": accountType
		});
		return res;
	}

	async signUpGoogle(credential: string) {
		const res: any = await fetchPost('member/signup-google', {
      'credential': credential,
			"accountType": "google"
		});
		return res;
	}

	async logout(
		userSeqId: number,
		refreshToken: string
	) {
		const res: any = await fetchPost(`users/${userSeqId}/logout`, { 'refreshToken': refreshToken });
		return res;
	}

	async findUserId(emailOrPhoneNumber: string): Promise<any[]> {
		const res: any = await fetchPost('users/id', {
			'emailOrPhoneNumber': emailOrPhoneNumber
		});
		return res.data;
	}

	async findUserInfo(userSeqId: number): Promise<any[]> {
		const res: any = await fetchGet(`users/${userSeqId}`, 'findUserInfo');
		return res;
	}

	async updateUserInfo(userSeqId: number, name: string, org: string, phone: string, email: string): Promise<any[]> {
		const res: any = await fetchPatch(`users/${userSeqId}/info`, {
			'name': name,
			'affiliation': org,
			'phoneNumber': phone,
			'email': email
		});
		return res;
	}

	async validatePassword(userSeqId: number, pwd: string): Promise<any[]> {
		const res: any = await fetchPost(`users/${userSeqId}/validate-password`, {
			'password': pwd
		});
		return res;
	}

	async updatePwd(userSeqId: number, pwd: string): Promise<any[]> {
		const res: any = await fetchPatch(`users/${userSeqId}/update-password`, {
			'password': pwd
		});
		return res;
	}

	async getUserList(startDate: string, endDate: string, keyword: string, page: number, limit: number) {
		const res: any = await fetchGet(`users?startDate=${startDate}&endDate=${endDate}&keyword=${keyword}&page=${page}&limit=${limit}`, 'getUserList');
		return res;
	}

	async getLoginHistoryList(startDate: string, endDate: string, keyword: string, page: number, limit: number) {
		const res: any = await fetchGet(`history?startDate=${startDate}&endDate=${endDate}&keyword=${keyword}&page=${page}&limit=${limit}`, 'getLoginHistoryList');
		return res;
	}
	
	async checkDuplicedUserId(userId: string): Promise<any> {
		// alert(`users/check?userId=${userId}`)
		const res: any = await fetchGet(`users/check?userId=${userId}`, 'checkDuplicedUserId');
		return res;
	}
}