import { ShipService } from "@/services/ShipService";

const shipService = new ShipService();

export async function getCurrentShipList() {
	return await shipService.getCurrentShipList();
}

export async function getImportantItemList() {
	return await shipService.getImportantItemList();
}

export async function getSaveTrendList() {
	return await shipService.getSaveTrendList();
}

export async function getStackerCraneSaveList() {
	return await shipService.getStackerCraneSaveList();
}

export async function getGantrySaveList() {
	return await shipService.getGantrySaveList();
}