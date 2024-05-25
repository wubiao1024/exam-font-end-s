export type GetRoleResponseAll = {
  code: number;
  data: GetRoleResponse[];
  message: string;
  success: boolean;
  [property: string]: any;
};

export type GetRoleResponse = {
  description: string;
  id: number;
  roleName: string;
  [property: string]: any;
};
