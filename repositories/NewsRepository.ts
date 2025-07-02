import { fetchGet } from "./req";

export class NewsRepository {
  async getRssMediaList() {
    const pathname = "media/all";
    const response = await fetchGet(`rss/${pathname}`, pathname);
    return response;
  }

  async getRssFeedList(mediaName: string) {
    const response = await fetchGet(`rss/feed/${mediaName}`, "feed-list");
    return response;
  }
}
