export type CleanListItem = {
  id: number;
  site: string;
  channel: string;
  currentState: string;
  searchKeyword: string;
  searchStartDate: string;
  searchEndDate: string;
  startDate: string;
  endDate: string;
  createDate: string;
  count: number;
  s3Url: string;
  fileSize: number;
  memId: number;
  extractNoun: boolean;
  extractVerb: boolean;
  extractAdjective: boolean;
};
