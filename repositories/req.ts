import repoData from "./repo.json";
import domainData from "./domain.json";

interface Repo {
  dummy?: Record<string, any>;
}

interface Domain {
  deployment: boolean;
  happ: string; 
  stock: string;
}

const repo: Repo = repoData;
const domain: Domain = domainData;

export async function reqGet(pathAndQuery: string, dummyName: string = "") {
  const result = await _reqGet(pathAndQuery, dummyName, domain.happ, domain.deployment);
  return result;
}

export async function reqMetricsGet(pathAndQuery: string, dummyName: string = "") {
  const result = await _reqGet(pathAndQuery, dummyName, domain.stock, domain.deployment);
  return result;
}

export async function reqHappGet(pathAndQuery: string, dummyName: string = "") {
  const result = await _reqGet(pathAndQuery, dummyName, domain.happ, domain.deployment);
  return result;
}

async function _reqGet(pathAndQuery: string, dummyName: string = "", domain: string, deployment: boolean) {
  const shouldUseRealAPI = deployment;
  const dummyData = repo.dummy?.[dummyName];

  if (shouldUseRealAPI) {
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
      // 실패 시 더미 데이터 fallback 가능
    }
  }

  // 더미 데이터 fallback
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

export async function reqPost(path: string, data: any = {}, dummyName: string = "") {
  const result = await _reqPost(domain.happ, path, data, dummyName, domain.deployment);
  return result;
}

export async function reqMetricsPost(path: string, data: any = {}, dummyName: string = "") {
  const result = await _reqPost(domain.stock, path, data, dummyName, domain.deployment);
  return result;
}

export async function reqHappPost(path: string, data: any = {}, dummyName: string = "") {
  const result = await _reqPost(domain.happ, path, data, dummyName, domain.deployment);
  return result;
}

export async function _reqPost(
  domain: string,
  path: string,
  data: any = {},
  dummyName: string = "",  
  deployment: boolean = true
) {
  const shouldUseRealAPI = deployment;
  const dummyData = repo.dummy?.[dummyName];

  if (shouldUseRealAPI) {
    try {
      const url = `${domain}/${path}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
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

// export async function reqPost(path: string, data: any = {}) {
//   try {
//     if (repo.deployment && repo.domain) {
//       console.log(`${repo.domain}/${path} Request => `, data);
//       const response = await fetch(`${repo.domain}/${path}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data)
//       });
//       if (!response.ok) throw new Error("데이터를 불러오지 못했습니다.");
//       const result = await response.json();
//       console.log(`${repo.domain}/${path} Respose => `, result);
//       return result;
//     }
//   } catch (e) {
//     console.error(e);
//     return null; // 오류 발생 시 `null` 반환
//   }
// }

export async function reqPut(path: string, data: any = {}) {
  try {
    if (domain.deployment && domain.happ) {
      const response = await fetch(`${domain.happ}/${path}`, {
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
    if (domain.deployment && domain.happ) {
      const response = await fetch(`${domain.happ}/${path}`, {
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
    if (domain.deployment && domain.happ) {
      const response = await fetch(`${domain.happ}/${path}`, {
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
