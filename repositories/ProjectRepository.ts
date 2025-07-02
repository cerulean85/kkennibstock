import {
  fetchGet,
  fetchHappGet,
  fetchMetricsGet,
  fetchMetricsPost,
  fetchHappPost,
  fetchPut,
  fetchDelete,
  fetchPost,
} from "./req";

export class ProfitRepository {
  private toppath: string = "project";
  async getProjectList(memId: number, pageNo: number, size: number) {
    return await fetchGet(`${this.toppath}/list?memId=${memId}&page=${pageNo}&size=${size}`);
  }

  async createProject(memId: number, name: string, description: string = "") {
    return await fetchPost(`${this.toppath}/create`, {
      memId: memId,
      name: name,
      desc: description,
    });
  }

  async update(memId: number, projectId: number, name: string, description: string) {
    return await fetchPut(`${this.toppath}/update`, {
      memId: memId,
      projectId: projectId,
      name: name,
      desc: description,
    });
  }

  async updateName(memId: number, projectId: number, name: string) {
    return await fetchPut(`${this.toppath}/update-name`, {
      memId: memId,
      projectId: projectId,
      name: name,
    });
  }
  async deleteProject(memId: number, projectId: number) {
    return await fetchDelete(`${this.toppath}/delete`, {
      memId: memId,
      projectId: projectId,
    });
  }
}
