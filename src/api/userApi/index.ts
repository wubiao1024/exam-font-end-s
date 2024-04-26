import { RequestDataEmmit, RequestEmit } from '@/api/tools';

export default class UserApi {
  public static login: RequestDataEmmit<any, any> = (data?) => {
    return RequestEmit({ path: '/api/user/login', method: 'post', data });
  };
  public static currentUser: RequestDataEmmit<any, any> = (data?) => {
    return RequestEmit({
      path: '/api/user/currentUser',
      method: 'get',
      data,
    });
  };
  public static logout: RequestDataEmmit<any, any> = (data?) => {
    return RequestEmit({
      path: '/api/user/logout',
      method: 'get',
      data,
    });
  };
  public static hello: RequestDataEmmit<any, any> = (data?) => {
    return RequestEmit({
      path: '/api/hello',
      method: 'get',
      data,
    });
  };
}
