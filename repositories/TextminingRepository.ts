import { fetchDelete, fetchGet, fetchPatch, fetchPost, fetchPut } from "./req";

export class TextminingRepository {
  async addNewWork(
    keyword: string,
    startDate: Date,
    endDate: Date,
    selectedChannels: string[],
    selectedCleans: string[],
    selectedAnalyses: string[],
    memberId: number,
    projectId: number
  ) {
    const res: any = await fetchPost("text-mining/create", {
      keyword: keyword,
      startDate: startDate,
      endDate: endDate,
      channel: selectedChannels,
      clean: selectedCleans,
      analysis: selectedAnalyses,
      memId: memberId,
      projectId: projectId,
    });
    return res;
  }

  async getDashboardData(memberId: number, projectId: number) {
    const res: any = await fetchGet(`text-mining/dashboard?memId=${memberId}&projectId=${projectId}`);
    return res;
  }

  async getSearchList(memberId: number, projectId: number) {
    const res: any = await fetchGet(`text-mining/search-list?memId=${memberId}&projectId=${projectId}`);
    return res;
  }

  async getCleanList(memberId: number, projectId: number) {
    const res: any = await fetchGet(`text-mining/clean-list?memId=${memberId}&projectId=${projectId}`);
    return res;
  }

  async getCleanData(taskId: number, pageNo: number, size: number = 100) {
    const res: any = await fetchGet(`text-mining/clean-data?taskId=${taskId}&page=${pageNo}&size=${size}`);
    return res;
  }

  async getFrequencyList(memberId: number, projectId: number) {
    const res: any = await fetchGet(`text-mining/frequency-list?memId=${memberId}&projectId=${projectId}`);
    return res;
  }

  async getFrequencyData(taskId: number, pageNo: number, size: number = 20) {
    const res: any = await fetchGet(`text-mining/frequency-data?taskId=${taskId}&page=${pageNo}&size=${size}`);
    return res;
  }

  async getTfidfList(memberId: number, projectId: number) {
    const res: any = await fetchGet(`text-mining/tfidf-list?memId=${memberId}&projectId=${projectId}`);
    return res;
  }

  async getTfidfData(taskId: number, pageNo: number, size: number = 100) {
    const res: any = await fetchGet(`text-mining/tfidf-data?taskId=${taskId}&page=${pageNo}&size=${size}`);
    return res;
  }

  async getConcorList(memberId: number, projectId: number) {
    const res: any = await fetchGet(`text-mining/concor-list?memId=${memberId}&projectId=${projectId}`);
    return res;
  }

  async getConcorData(taskId: number, pageNo: number, size: number = 100) {
    const res: any = await fetchGet(`text-mining/concor-data?taskId=${taskId}&page=${pageNo}&size=${size}`);
    return res;
  }

  async deleteSearchList(taskIdList: number[]) {
    const res: any = await fetchDelete("text-mining/search-list", {
      taskIdList: taskIdList,
    });
    return res;
  }

  async deleteCleanList(taskIdList: number[]) {
    const res: any = await fetchDelete("text-mining/clean-list", {
      taskIdList: taskIdList,
    });
    return res;
  }

  async deleteFrequencyList(taskIdList: number[]) {
    const res: any = await fetchDelete("text-mining/frequency-list", {
      taskIdList: taskIdList,
    });
    return res;
  }

  async deleteTfidfList(taskIdList: number[]) {
    const res: any = await fetchDelete("text-mining/tfidf-list", {
      taskIdList: taskIdList,
    });
    return res;
  }
  async deleteConcorList(taskIdList: number[]) {
    const res: any = await fetchDelete("text-mining/concor-list", {
      taskIdList: taskIdList,
    });
    return res;
  }
}
