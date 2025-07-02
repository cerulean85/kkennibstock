import { ProfitRepository } from "@/repositories/ProjectRepository";
import { BaseService } from "./BaseService";
import { ProjectItem, ProjectResponse } from "@/model/ProjectItem";

export class ProjectService extends BaseService {
  private repo: ProfitRepository;

  constructor() {
    super();
    this.repo = new ProfitRepository();
  }

  async getProjectList(pageNo: number, size: number = 30): Promise<ProjectResponse> {
    let memNo = localStorage.getItem("no");
    if (!memNo) return {} as ProjectResponse;
    const response = await this.repo.getProjectList(Number(memNo), pageNo, size);
    return this.getData(response);
  }

  async createProject(name: string, description: string = ""): Promise<ProjectItem> {
    let memNo = localStorage.getItem("no");
    if (!memNo) return {} as ProjectItem;
    const response: any = await this.repo.createProject(Number(memNo), name, description);
    return this.getData(response);
  }

  async updateProject(projectId: number, name: string, description: string): Promise<ProjectItem> {
    let memNo = localStorage.getItem("no");
    if (!memNo) return {} as ProjectItem;
    const response: any = await this.repo.update(Number(memNo), projectId, name, description);
    return this.getData(response);
  }

  async updateProjectName(projectId: number, name: string): Promise<Boolean> {
    let memNo = localStorage.getItem("no");
    if (!memNo) return false;
    const response: any = await this.repo.updateName(Number(memNo), projectId, name);
    return this.getData(response);
  }

  async deleteProject(projectId: number): Promise<Boolean> {
    let memNo = localStorage.getItem("no");
    if (!memNo) return false;
    const response: any = await this.repo.deleteProject(Number(memNo), projectId);
    return this.getData(response);
  }
}
