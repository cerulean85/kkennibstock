export class BaseService {
  getData(response: any) {
    console.trace("Message By BaseService", response);
    if (!response) {
      console.log("Failed to fetch data..");
      return null;
    }

    if (!response.isSuccess) {
      alert(response.message);
      return null;
    }

    if (!response.data) {
      console.log("Failed to fetch data..");
      return null;
    }
    return response.data;
  }
}
