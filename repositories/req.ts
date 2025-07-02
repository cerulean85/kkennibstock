import repoData from "./repo.json";

interface Repo {
  dummy?: Record<string, any>;
}

const repo: Repo = repoData;

export async function fetchGet(pathAndQuery: string, dummyName: string = "") {
  const result = await _fetchGet(pathAndQuery, dummyName, process.env.NEXT_PUBLIC_API_BASE_URL ?? "");
  return result;
}

export async function fetchMetricsGet(pathAndQuery: string, dummyName: string = "") {
  const result = await _fetchGet(pathAndQuery, dummyName, process.env.NEXT_PUBLIC_API_STOCK_URL ?? "");
  return result;
}

export async function fetchHappGet(pathAndQuery: string, dummyName: string = "") {
  const result = await _fetchGet(pathAndQuery, dummyName, process.env.NEXT_PUBLIC_API_BASE_URL ?? "");
  return result;
}

async function _fetchGet(pathAndQuery: string, dummyName: string = "", domain: string) {
  const dummyData = repo.dummy?.[dummyName];
  try {
    const url = `${domain}/${pathAndQuery}`;
    const response = await fetch(url);

    if (response.ok) {
      const result = await response.json();
      console.log("API 응답:", result);
      return result;
    }
  } catch (error) {
    console.error("실제 API 호출 실패:", error);
  }

  if (dummyData) {
    console.error(`dummy [${dummyName}] 데이터 반환 =>`);
    console.error(dummyData);
    return {
      isSuccess: true,
      message: "더미 데이터입니다.",
      data: dummyData,
    };
  }

  console.error(`dummy 데이터에서 '${dummyName}'을 찾을 수 없습니다.`);
  return null;
}

export async function fetchPost(path: string, data: any = {}, dummyName: string = "") {
  const result = await _fetchPost(process.env.NEXT_PUBLIC_API_BASE_URL ?? "", path, data, dummyName);
  return result;
}

export async function fetchMetricsPost(path: string, data: any = {}, dummyName: string = "") {
  const result = await _fetchPost(process.env.NEXT_PUBLIC_API_STOCK_URL ?? "", path, data, dummyName);
  return result;
}

export async function fetchHappPost(path: string, data: any = {}, dummyName: string = "") {
  const result = await _fetchPost(process.env.NEXT_PUBLIC_API_BASE_URL ?? "", path, data, dummyName);
  return result;
}

export async function _fetchPost(domain: string, path: string, data: any = {}, dummyName: string = "") {
  const dummyData = repo.dummy?.[dummyName];

  try {
    const url = `${domain}/${path}`;
    console.log(url);
    console.log(data);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("API 응답:", result);
      return result;
    }
  } catch (error) {
    console.error("실제 API 호출 실패:", error);
    // 실패 시 더미 데이터 fallback 가능
  }

  // 더미 데이터 fallback
  if (dummyData) {
    console.error(`dummy [${dummyName}] 데이터 반환`);
    return {
      isSuccess: true,
      message: "더미 데이터입니다.",
      data: dummyData,
    };
  }

  console.error(`dummy 데이터에서 '${dummyName}'을 찾을 수 없습니다.`);
  return null;
}

export async function fetchPostWithAuth(path: string, data: any = {}) {
  async function _fetchWithAuth() {
    return await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
  }

  const accessToken = localStorage.getItem("accessToken");
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/${path}`;
  let res = await _fetchWithAuth();

  if (res.status === 401) {
    // Access Token 만료 시 재발급
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    const tokens = await refreshRes.json();
    localStorage.setItem("accessToken", tokens.accessToken);
    res = await _fetchWithAuth();
  }

  return res;
}

export async function fetchPostWithCookie(path: string, credential: string) {
  let result = null;
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/${path}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: credential }),
      credentials: "include",
    });

    if (!response.ok) return false;
    result = await response.json();
  } catch (error) {
    console.error("실제 API 호출 실패:", error);
    return false;
  }

  localStorage.setItem("accessToken", result.accessToken);
  return true;
}

export async function fetchPut(path: string, data: any = {}) {
  try {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/${path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

export async function fetchPatch(path: string, data: any = {}) {
  try {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/${path}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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

export async function fetchDelete(path: string, data: any = {}) {
  try {
    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/${path}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
