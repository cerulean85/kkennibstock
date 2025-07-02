import { NewsRepository } from "@/repositories/NewsRepository";
import { BaseService } from "./BaseService";

export class NewsService extends BaseService {
  private repo: NewsRepository;

  constructor() {
    super();
    this.repo = new NewsRepository();
  }

  async getRssMediaList() {
    const response = await this.repo.getRssMediaList();
    return response;
  }

  async getRssFeedList(mediaName: string) {
    const response = await this.repo.getRssFeedList(mediaName);
    return response;
  }
}
