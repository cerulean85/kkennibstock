import { Alarm } from "@/models/Alarm";
import { AlarmRepository } from "@/repositories/AlarmRepository";

export class AlarmService {
	private repo: AlarmRepository;

	constructor() {
		this.repo = new AlarmRepository();
	}

	async getAlarmList(): Promise<Alarm[]> {
		return await this.repo.getAlarmList();
	}

	async getAlarmDetail(id: string): Promise<Alarm> {
		return await this.repo.getAlarmDetail(id);
	}
}