import { NotiService } from "@/services/NotiService";

const notiService = new NotiService();

export async function getNotiList() {
	return await notiService.getNotiList();
}

export async function getNotiDetail(id: string) {
	return await notiService.getNotiDetail(id);
}