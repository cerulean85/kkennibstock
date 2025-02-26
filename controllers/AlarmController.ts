import { AlarmService } from "@/services/AlarmService";

const alarmService = new AlarmService();

export async function getAlarmList() {
	return await alarmService.getAlarmList();
}

export async function getAlarmDetail(id: string) {
	return await alarmService.getAlarmDetail(id);
}