import { fetchDelete, fetchGet, fetchPatch, fetchPost, fetchPut } from "./req"

export class TextminingRepository {

	async addNewWork(
		keyword: string,
		startDate: Date,
		endDate: Date,
		selectedChannels: string[],
		selectedCleans: string[],
		selectedAnalyses: string[],
		memberId: number) {
		const res: any = await fetchPost('text-mining/create', {
			"keyword": keyword,
			"startDate": startDate,
			"endDate": endDate,
			"channel": selectedChannels,
			"clean": selectedCleans,
			"analysis": selectedAnalyses,
			"memId": memberId
		});
		return res;
	}

	async getSearchList(memberId: number) {
		const res: any = await fetchGet(`text-mining/search-list?memId=${memberId}`);
		return res;
	}

	async getCleanList(memberId: number) {
		const res: any = await fetchGet(`text-mining/clean-list?memId=${memberId}`);
		return res;
	}

	async getFrequencyList(memberId: number) {
		const res: any = await fetchGet(`text-mining/frequency-list?memId=${memberId}`);
		return res;
	}

	async getTfidfList(memberId: number) {
		const res: any = await fetchGet(`text-mining/tfidf-list?memId=${memberId}`);
		return res;
	}

	async getConcorList(memberId: number) {
		const res: any = await fetchGet(`text-mining/concor-list?memId=${memberId}`);
		return res;
	}

	async deleteSearchList(taskIdList: number[]) {
		const res: any = await fetchDelete('text-mining/search-list', {
			'taskIdList': taskIdList
		});
		return res;
	}

	async deleteCleanList(taskIdList: number[]) {
		const res: any = await fetchDelete('text-mining/clean-list', {
			'taskIdList': taskIdList
		});
		return res;
	}

	async deleteFrequencyList(taskIdList: number[]) {
		const res: any = await fetchDelete('text-mining/frequency-list', {
			'taskIdList': taskIdList
		});
		return res;
	}

	async deleteTfidfList(taskIdList: number[]) {
		const res: any = await fetchDelete('text-mining/tfidf-list', {
			'taskIdList': taskIdList
		});
		return res;
	}
	async deleteConcorList(taskIdList: number[]) {
		const res: any = await fetchDelete('text-mining/concor-list', {
			'taskIdList': taskIdList
		});
		return res;
	}
}