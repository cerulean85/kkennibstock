import repoData from "./repo.json";
import { getCookieValue } from "@/lib/utils";

interface Repo {
  domain?: string;
  deployment?: boolean;
  dummy?: Record<string, any>;
}

const repo: Repo = repoData; // JSON 데이터를 Repo 타입으로 변환

export async function reqGet(pathAndQuery: string, dummyName: string = "", useDummy: boolean = false) {
  try {
    if ((repo.deployment && repo.domain) && !useDummy) {
      const response = await fetch(`${repo.domain}/${pathAndQuery}`);
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const result = await response.json();
      console.log("result", result);
      return result;
    } else if (repo.dummy && repo.dummy[dummyName]) { 
      return {
        status: {
          isSuccess: true,
          message: "더미 데이터입니다."
        },
        data: repo.dummy[dummyName]
      };
    } else {
      throw new Error(`dummy 데이터에서 '${dummyName}'을 찾을 수 없습니다.`);
    }
  } catch (e) {
    console.error(e);
    return null; // 오류 발생 시 `null` 반환
  }
}

export async function reqPost(path: string, data: any = {}) {
  try {
    if (repo.deployment && repo.domain) {
      console.log(`${repo.domain}/${path} Request => `, data);
      const response = await fetch(`${repo.domain}/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const result = await response.json();
      console.log(`${repo.domain}/${path} Respose => `, result);
      return result;
    }
  } catch (e) {
    console.error(e);
    return null; // 오류 발생 시 `null` 반환
  }
}

export async function reqPut(path: string, data: any = {}) {
  try {
    if (repo.deployment && repo.domain) {
      const response = await fetch(`${repo.domain}/${path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const result = await response.json();
      
      return result;
    }
  } catch (e) {
    console.error(e);
    return null; // 오류 발생 시 `null` 반환
  }
}

export async function reqPatch(path: string, data: any = {}) {
  try {
    if (repo.deployment && repo.domain) {
      const response = await fetch(`${repo.domain}/${path}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const result = await response.json();
      
      return result;
    }
  } catch (e) {
    console.error(e);
    return null; // 오류 발생 시 `null` 반환
  }
}

export async function reqDelete(path: string, data: any = {}) {
  try {
    if (repo.deployment && repo.domain) {
      const response = await fetch(`${repo.domain}/${path}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
      const result = await response.json();
      
      return result;
    }
  } catch (e) {
    console.error(e);
    return null; // 오류 발생 시 `null` 반환
  }
}
