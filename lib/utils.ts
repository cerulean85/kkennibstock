export function sumByKeyUpToIndex(arr: any[], key: string, index: number) {
	return arr.slice(0, index + 1).reduce((sum, obj) => sum + (obj[key] || 0), 0);
}

function sumUpToIndex(arr: any[], index: number) {
	return arr.slice(0, index + 1).reduce((sum, num) => sum + num, 0);
}

export function cumulativeSum(arr: any) {
	let sum = 0;
	return arr.map((num: number) => (sum += num));
}