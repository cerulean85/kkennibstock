export class BaseService {

  getData(response: any) {

		console.trace('Message By BaseService', response);
		if (!response) {
			console.log("데이터 호출에 실패하였습니다.");
			return null;
		}
    
		if (!response.isSuccess) {
			alert(response.message);
			return null;
		}

		if (!response.data) {
			console.log("데이터 호출에 실패하였습니다.");
			return null;
		}
		return response.data;		
  }
}
