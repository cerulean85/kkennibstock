import { reqGet } from "./req"

export class NewsRepository {
	async getRssMediaList() {
		const pathname = "media/all";
		const response = await reqGet(`rss/${pathname}`, pathname);
		return response;
	}

	async getRssFeedList(mediaName: string) {
		const response = await reqGet(`rss/feed/${mediaName}`, "feed-list");
		return response;
	}
}