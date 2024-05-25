import { RequestEmit } from '@/api/tools';
import { RequestDataEmmit } from '@/api/const';
import {
  AddUserRequest,
  GetUsersRequest,
  GetUsersResponse,
  UpdatePasswordRequest,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserRolesRequest,
  UpdateUserRolesResponse,
} from '@/api/userApi/types';

export default class UserApi {
  public static login: RequestDataEmmit<{ username: string; password: string }, { token: string }> =
    (data?) => {
      return RequestEmit({ path: '/api/user/login', method: 'post', data });
    };
  //查询个人信息
  public static currentUser: RequestDataEmmit<any, any> = (data) => {
    return RequestEmit({
      path: '/api/user/currentUser',
      method: 'get',
      data,
    });
  };

  //退出登录
  public static logout: RequestDataEmmit<never, any> = (data) => {
    return RequestEmit({
      path: '/api/user/logout',
      method: 'get',
      data,
    });
  };

  //修改个人信息
  public static updateUserInfo: RequestDataEmmit<UpdateUserRequest, UpdateUserResponse> = (
    data,
  ) => {
    return RequestEmit({
      path: '/api/user/updateUserInfo',
      method: 'PUT',
      data,
    });
  };

  //修改个人信息
  public static updatePassword: RequestDataEmmit<UpdatePasswordRequest, UpdateUserResponse> = (
    data,
  ) => {
    return RequestEmit({
      path: '/api/user/updatePassword',
      method: 'PUT',
      data,
    });
  };

  // 修改用户角色信息
  public static updateUserRoles: RequestDataEmmit<UpdateUserRolesRequest, UpdateUserRolesResponse> =
    (data) => {
      return RequestEmit({
        path: '/api/user/updateUser',
        method: 'PUT',
        data,
      });
    };

  // 查询所有用户信息
  public static getAllUsers: RequestDataEmmit<GetUsersRequest, GetUsersResponse> = (data) => {
    return RequestEmit({
      path: '/api/user/getUsers',
      method: 'POST',
      data,
    });
  };

  // 查询所有考生信息
  public static getUsersWithRole: RequestDataEmmit<
    GetUsersRequest & { role?: string },
    GetUsersResponse
  > = (data) => {
    return RequestEmit({
      path: '/api/user/getUsersWithRole',
      method: 'POST',
      data,
    });
  };

  //教务员 删除用户
  public static addUser: RequestDataEmmit<AddUserRequest, any> = (data) => {
    return RequestEmit({
      path: '/api/user/addUser',
      method: 'POST',
      data,
    });
  };

  //教务员 删除用户
  public static deleteUser: RequestDataEmmit<{ id: number }, any> = (data) => {
    return RequestEmit({
      path: '/api/user/deleteUser/:id',
      method: 'DELETE',
      data,
    });
  };
}
