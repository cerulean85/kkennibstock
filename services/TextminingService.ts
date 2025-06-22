import { TextminingRepository } from "@/repositories/TextminingRepository";
import { BaseService } from "./BaseService";


export type SearchListItem = {
	id: number;
	site: string;
	channel: string;
	currentState: string;
	searchKeyword: string;
	searchStartDate: string;
	searchEndDate: string;
	workerIp: string;
	startDate: string;
	endDate: string;
	createDate: string;
	count: number;
	s3Url: string;
	fileSize: number;
	memId: number;
};

export class TextminingService extends BaseService {

	
	private repo: TextminingRepository;

	constructor() {
		super();
		this.repo = new TextminingRepository();
	}

	async addNewWork(
		keyword: string,
		startDate: Date,
		endDate: Date,
		selectedChannels: string[],
		selectedCleans: string[],
		selectedAnalyses: string[]
	) {
		let memNo = localStorage.getItem("no");
		if (!memNo) return;
		const response: any = await this.repo.addNewWork(keyword, startDate, endDate, selectedChannels, selectedCleans, selectedAnalyses, Number(memNo));		
		return this.getData(response);
	}

	async getSearchList() {
		let memNo = localStorage.getItem("no");
		if (!memNo) return;
		const response: any = await this.repo.getSearchList(Number(memNo));

		const data = this.getData(response);
		for (let i = 0; i < data.list.length; i++) {
			const item = data.list[i];
			item.createDate = item.createDate ? new Date(item.createDate).toLocaleString() : "";
			item.startDate = item.startDate ? new Date(item.startDate).toLocaleString() : "";
			item.endDate = item.endDate ? new Date(item.endDate).toLocaleString() : "";
			item.searchStartDate = item.searchStartDate ? new Date(item.searchStartDate).toLocaleString() : "";
			item.searchEndDate = item.searchEndDate ? new Date(item.searchEndDate).toLocaleString() : "";
		}
		return data;
	}

	async getClenanList() {
		let memNo = localStorage.getItem("no");
		if (!memNo) return;
		const response: any = await this.repo.getCleanList(Number(memNo));
		return this.getData(response);
	}

	async getFrequencyList() {
		let memNo = localStorage.getItem("no");
		if (!memNo) return;
		const response: any = await this.repo.getFrequencyList(Number(memNo));
		return this.getData(response);
	}

	async getTfidfList() {
		let memNo = localStorage.getItem("no");
		if (!memNo) return;
		const response: any = await this.repo.getTfidfList(Number(memNo));
		return this.getData(response);
	}

	async getConcorList() {
		let memNo = localStorage.getItem("no");
		if (!memNo) return;
		const response: any = await this.repo.getConcorList(Number(memNo));
		return this.getData(response);
	}
	async deleteSearchList(taskIdList: number[]) {
		const response: any = await this.repo.deleteSearchList(taskIdList);
		return this.getData(response);
	}	
	async deleteCleanList(taskIdList: number[]) {
		const response: any = await this.repo.deleteCleanList(taskIdList);
		return this.getData(response);
	}	
	async deleteFrequencyList(taskIdList: number[]) {
		const response: any = await this.repo.deleteFrequencyList(taskIdList);
		return this.getData(response);
	}	
	async deleteTfidfList(taskIdList: number[]) {
		const response: any = await this.repo.deleteTfidfList(taskIdList);
		return this.getData(response);
	}			
	async deleteConcorList(taskIdList: number[]) {
		const response: any = await this.repo.deleteConcorList(taskIdList);
		return this.getData(response);
	}		
}
