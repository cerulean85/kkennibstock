import { reqGet } from "./req"

export class MetricsRepository {
	async getVixData() {
		const keyname = "vix";
		const res = await reqGet(`----/${keyname}/`, keyname, true);
		const list = res.data.map((obj: any) => {
			const [key, value] = Object.entries(obj)[0];
			return { x: key, y: value }
		})
		return list;
	}
}