export type GetUsersRequest = {
  classId?: number | null;
  current?: number | null;
  /**
   * 用户id
   */
  id?: number | null;
  pageSize?: number | null;
  realName?: null | string;
  username?: null | string;
  [property: string]: any;
};

export type GetUsersResponseAll = {
  code: number;
  data: GetUsersResponse;
  message: string;
  success: boolean;
  [property: string]: any;
};

export type GetUsersResponse = {
  current: number;
  listTotalCount: number;
  pageSize: number;
  pageTotalCount: number;
  userList: UserList[];
  [property: string]: any;
};

export type UserList = {
  classId: number;
  contactInfo: string;
  id: number;
  nickname: string;
  realName: string;
  roles: Role[];
  username: string;
  [property: string]: any;
};

export type Role = {
  description: string;
  id: number;
  roleName: string;
  [property: string]: any;
};

export type UpdateUserRolesRequest = {
  id: number;
  classId: number;
  roleIds: number[];
  [property: string]: any;
};

export type UpdateUserRolesResponse = {
  code: number;
  data: any;
  message: string;
  success: boolean;
  [property: string]: any;
};

export type UpdatePasswordRequest = {
  id: number;
  oldPassword: string;
  newPassword: string;
};

export type UpdateUserRequest = {
  /**
   * 联系方式
   */
  contactInfo?: null | string;
  id?: number | null;
  /**
   * 昵称
   */
  nickname?: null | string;
  /**
   * 真实姓名
   */
  realName?: null | string;
  /**
   * 用户名
   */
  username?: null | string;
  /**
   * 邮箱
   */
  email?: null | string;
  /**
   * 性别 0-男 1-女
   */
  gender?: 0 | 1;

  [property: string]: any;
};

export type UpdateUserResponse = {
  code: number;
  data: any;
  message: string;
  success: boolean;
  [property: string]: any;
};

/**
 * UserDTO
 */
export type AddUserRequest = {
  /**
   * 班级id
   */
  classId?: number | null;

  /**
   * 真实姓名
   */
  realName?: null | string;
  /**
   * 用户具有的角色
   */
  roleIds?: number[] | null;
  /**
   * 登录名
   */
  username?: null | string;
  [property: string]: any;
};
