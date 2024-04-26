import { RequestDataEmmit, RequestEmit } from '@/api/tools';

export default class paperApi {
  public static get: RequestDataEmmit<any, any> = (data?) => {
    return RequestEmit({ path: '/api/user/login', method: 'post', data });
  };
}
