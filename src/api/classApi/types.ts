export type GetAllClassesResponse = {
  className: string;
  id: number;
  description?: null | string;
  [property: string]: any;
}[];

export type GetAllClassesResponseWithPage = {
  listTotalCount: number;
  pageTotalCount: number;
  classList: GetAllClassesResponse;
  [property: string]: any;
};

export type GetAllClassesWithPageRequest = {
  classId?: number | null;
  className?: null | string;
  current: number | null;
  pageSize: number | null;
  [property: string]: any;
};

export type AddClassRequest = {
  className: null | string;
  description?: null | string;
  [property: string]: any;
};

export type UpdateClassRequest = {
  id: number;
  className: null | string;
  description?: null | string;
  [property: string]: any;
};
