import { RequestDataEmmit } from '@/api/const';
import { GetRoleResponse, GetRoleResponseAll } from '@/api/roleApi/type';
import { RequestEmit } from '@/api/tools';

export default class roleApi {
  public static getRoles: RequestDataEmmit<never, GetRoleResponseAll> = () => {
    return RequestEmit({
      method: 'GET',
      path: '/api/role/getRoles',
    });
  };
}
