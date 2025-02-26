import repo from "./repo.json"

export async function reqGet(domain: string) {
	const response = await fetch(`${repo.apiUrl}/${domain}`);
	return response;
}