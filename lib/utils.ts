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

export const getWeekNumber = (startDate: string): number => {
		const start = new Date(startDate); // 기준이 되는 시작 날짜
		const today = new Date(); // 현재 날짜
	
		// 시작 날짜의 시간을 00:00:00으로 설정
		start.setHours(0, 0, 0, 0);
		today.setHours(0, 0, 0, 0);
	
		// 경과한 일수 계산
		const diffTime = today.getTime() - start.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	
		// 주차 계산 (1주차부터 시작)
		return Math.floor(diffDays / 7) + 1;
	};

export const getTodayDate = () => {
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, "0"); // 월 (0부터 시작하므로 +1 필요)
	const dd = String(today.getDate()).padStart(2, "0"); // 일
	const formattedDate = `${yyyy}-${mm}-${dd}`;
	return formattedDate
}

export function getDateFiveWeeksAgoStr(startDate: string | Date): string {
	const date = new Date(startDate);
	date.setDate(date.getDate() - 5 * 7); // 5주 전 (5 * 7일)
	
	return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식 반환
}

export function getDateFiveWeeksAgo(startDate: Date): Date {
	const date = new Date(startDate);
	date.setDate(date.getDate() - 5 * 7);
	return date
}

export function getDateOneYearAgo(startDate: Date): Date {
	const date = new Date(startDate);
	date.setDate(date.getDate() - 365);
	return date;
}

export function getDate7DaysAgo(startDate: Date): Date {
	startDate.setDate(startDate.getDate() - 7); // 5주 전 (5 * 7일)	
	return startDate; // YYYY-MM-DD 형식 반환
}

export function getDateOneMonthAgo(startDate: Date): Date {
	const date = new Date(startDate);
	date.setMonth(date.getMonth() - 1);
	return date;
}

export function getDateOneMonthAfter(startDate: Date): Date {
	const date = new Date(startDate);
	date.setMonth(date.getMonth() + 1);
	return date;
}

export function getDateOneDayAfter(startDate: Date | null): Date {
	if (startDate === null) return new Date(); // null인 경우 현재 날짜 반환
	const targetDate = new Date();
	targetDate.setDate(startDate.getDate() + 1);
	return targetDate; // YYYY-MM-DD 형식 반환
}

export function getDateOneDayBefore(startDate: Date | null): Date {
	if (startDate === null) return new Date(); // null인 경우 현재 날짜 반환
	const targetDate = new Date();
	targetDate.setDate(startDate.getDate() - 1);
	return targetDate; // YYYY-MM-DD 형식 반환
}

export function getCookieValue(cookieName: string): string | undefined {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${cookieName}=`));
  return cookie ? cookie.split('=')[1] : undefined;
}


export function validateToken(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now(); // 만료 시간 확인
  } catch (error) {
    return false;
  }
}

export const formatDate = (date: Date | null): string => {
	if (!date) return ''; // null인 경우 빈 문자열 반환
	return date ? date.toISOString().substring(0, 10) : ''; // YYYY-MM-DD 형식으로 변환
};

export const formatUtcToKstYMD = (utcDateStr: string): string => {
  if (!utcDateStr) return '';

  const utcDate = new Date(utcDateStr);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000); // +9시간

  const yyyy = kstDate.getFullYear();
  const mm = String(kstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const summarizeNameList = (userList: any[]) => {
	const userCount = userList.length;
	const firstUserName = userList[0];
	const summarized = userCount > 1 ? `${firstUserName} 외 ${userCount - 1}명` : firstUserName;
	return summarized;
}


export const convertUtcToKst = (utcDateStr: string): string => {
	const utcDate: Date = new Date(utcDateStr);
  const options = { timeZone: "Asia/Seoul" };
  const koreaDate = new Date(utcDate.toLocaleString("en-US", options));

  const yyyy = koreaDate.getFullYear();
  const MM = String(koreaDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const dd = String(koreaDate.getDate()).padStart(2, '0');
  const HH = String(koreaDate.getHours()).padStart(2, '0');
  const mm = String(koreaDate.getMinutes()).padStart(2, '0');
  const ss = String(koreaDate.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

export const getOnlyDate = (date:string) => {
	return date.split(' ')[0];
}

export const convertUtcDateToKstStr = (utcDate: Date): string => {
  const options = { timeZone: "Asia/Seoul" };
  const koreaDate = new Date(utcDate.toLocaleString("en-US", options));

  const yyyy = koreaDate.getFullYear();
  const MM = String(koreaDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const dd = String(koreaDate.getDate()).padStart(2, '0');
  const HH = String(koreaDate.getHours()).padStart(2, '0');
  const mm = String(koreaDate.getMinutes()).padStart(2, '0');
  const ss = String(koreaDate.getSeconds()).padStart(2, '0');

	const result = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
  return result;
}

export const convertUtcToKst2 = (utcDateStr: string): string => {
	console.log('utcDateStr', utcDateStr)
	const utcDate: Date = new Date(utcDateStr);
  const options = { timeZone: "Asia/Seoul" };
  const koreaDate = new Date(utcDate.toLocaleString("en-US", options));

  const yyyy = koreaDate.getFullYear();
  const MM = String(koreaDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const dd = String(koreaDate.getDate()).padStart(2, '0');
  const HH = String(koreaDate.getHours()).padStart(2, '0');
  const mm = String(koreaDate.getMinutes()).padStart(2, '0');
  const ss = String(koreaDate.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}

export function getFirstDateOfMonth(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getFirstDateOfMonthStr(date: Date): string {
	return convertUtcDateToKstStr(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function convertToStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function convertToEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 0);
  return newDate;
}

export function toHourMinuteString(n: number): string {
	if (n < 0) return '0분';
	const hour = Math.floor(n / 60);
	const minute = n % 60;
	if (hour === 0) return `${minute}분`;
	if (minute === 0) return `${hour}시간`;
	return `${hour}시간 ${minute}분`;
}

export function aggregateByWeek(
  data: { date: string; currentCount: number; cumulativeCount: number }[]
) {
  // 주차 계산 함수 (ISO week, 월요일 시작)
  function getISOWeek(dateStr: string) {
    const date = new Date(dateStr);
    const tmp = new Date(date.getTime());
    tmp.setHours(0, 0, 0, 0);
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));
    const week1 = new Date(tmp.getFullYear(), 0, 4);
    return (
      tmp.getFullYear() +
      '-W' +
      String(
        1 +
          Math.round(
            ((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
          )
      ).padStart(2, '0')
    );
  }

  // 주단위 집계
  const weekMap: Record<string, { currentCount: number; lastCumulative: number; dates: string[] }> = {};

  for (const row of data) {
    const week = getISOWeek(row.date);
    if (!weekMap[week]) {
      weekMap[week] = { currentCount: 0, lastCumulative: 0, dates: [] };
    }
    weekMap[week].currentCount += row.currentCount;
    weekMap[week].lastCumulative = row.cumulativeCount;
    weekMap[week].dates.push(row.date);
  }

  // 최신 주차가 마지막에 오도록 정렬
  const sortedWeeks = Object.entries(weekMap).sort((a, b) => {
    return new Date(a[1].dates[0]).getTime() - new Date(b[1].dates[0]).getTime();
  });

  // 주차 라벨 생성 (지난주, 2주전, ...)
  const totalWeeks = sortedWeeks.length;
  return sortedWeeks.map(([week, val], idx) => {
    let weekRange = '';
    const diff = totalWeeks - idx;
    if (diff === 1) weekRange = '지난주';
    else weekRange = `${diff}주전`;
    return {
      date: weekRange,
      startDate: val.dates[0],
      endDate: val.dates[val.dates.length - 1],
      currentCount: val.currentCount,
      cumulativeCount: val.lastCumulative,
    };
  });
}

export function aggregateByMonth(
  data: { date: string; currentCount: number; cumulativeCount: number }[]
) {
  // 월 계산 함수 (YYYY-MM)
  function getMonth(dateStr: string) {
    const date = new Date(dateStr);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  }

  // 월별 집계
  const monthMap: Record<string, { currentCount: number; lastCumulative: number; dates: string[] }> = {};

  for (const row of data) {
    const month = getMonth(row.date);
    if (!monthMap[month]) {
      monthMap[month] = { currentCount: 0, lastCumulative: 0, dates: [] };
    }
    monthMap[month].currentCount += row.currentCount;
    monthMap[month].lastCumulative = row.cumulativeCount;
    monthMap[month].dates.push(row.date);
  }

  // 월 정렬 (오름차순)
  const sortedMonths = Object.entries(monthMap).sort((a, b) => {
    return new Date(a[1].dates[0]).getTime() - new Date(b[1].dates[0]).getTime();
  });

  // 월 라벨 생성 (YYYY-MM)
  return sortedMonths.map(([month, val]) => ({
    date: month,
    startDate: val.dates[0],
    endDate: val.dates[val.dates.length - 1],
    currentCount: val.currentCount,
    cumulativeCount: val.lastCumulative,
  }));
}