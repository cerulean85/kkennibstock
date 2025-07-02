export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  createDate: Date;
  memberId: number;
}

export interface ProjectResponse {
  list: ProjectItem[];
  itemCount: number;
  totalCount: number;
}
