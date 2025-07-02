import { TextminingRepository } from "@/repositories/TextminingRepository";
import { BaseService } from "./BaseService";

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

    let projectId = localStorage.getItem("selectedProjectId");
    if (!projectId) return;

    const response: any = await this.repo.addNewWork(
      keyword,
      startDate,
      endDate,
      selectedChannels,
      selectedCleans,
      selectedAnalyses,
      Number(memNo),
      Number(projectId)
    );
    return this.getData(response);
  }

  async getSearchList() {
    let memNo = localStorage.getItem("no");
    if (!memNo) return;

    let projectId = localStorage.getItem("selectedProjectId");
    if (!projectId) return;

    const response: any = await this.repo.getSearchList(Number(memNo), Number(projectId));

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

  async getCleanList() {
    let memNo = localStorage.getItem("no");
    if (!memNo) return;

    let projectId = localStorage.getItem("selectedProjectId");
    if (!projectId) return;

    const response: any = await this.repo.getCleanList(Number(memNo), Number(projectId));

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

  async getCleanData(taskId: number, pageNo: number, size: number = 100) {
    const response: any = await this.repo.getCleanData(taskId, pageNo, size);
    const data = this.getData(response);
    return data;
  }

  async getFrequencyList() {
    let memNo = localStorage.getItem("no");
    if (!memNo) return;

    let projectId = localStorage.getItem("selectedProjectId");
    if (!projectId) return;

    const response: any = await this.repo.getFrequencyList(Number(memNo), Number(projectId));
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

  async getFrequencyData(taskId: number, pageNo: number, size: number = 100) {
    const response: any = await this.repo.getFrequencyData(taskId, pageNo, size);
    const data = this.getData(response);
    return data;
  }

  async getTfidfList() {
    let memNo = localStorage.getItem("no");
    if (!memNo) return;

    let projectId = localStorage.getItem("selectedProjectId");
    if (!projectId) return;

    const response: any = await this.repo.getTfidfList(Number(memNo), Number(projectId));
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

  async getTfidfData(taskId: number, pageNo: number, size: number = 100) {
    const response: any = await this.repo.getTfidfData(taskId, pageNo, size);
    const data = this.getData(response);
    return data;
  }

  async getConcorList() {
    let memNo = localStorage.getItem("no");
    if (!memNo) return;

    let projectId = localStorage.getItem("selectedProjectId");
    if (!projectId) return;

    const response: any = await this.repo.getConcorList(Number(memNo), Number(projectId));
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

  async getConcorData(taskId: number, pageNo: number, size: number = 100) {
    const response: any = await this.repo.getConcorData(taskId, pageNo, size);
    const data = this.getData(response);
    return data;
  }
}
