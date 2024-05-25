import { RequestDataEmmit } from '@/api/const';
import {
  AddClassRequest,
  GetAllClassesResponse,
  GetAllClassesWithPageRequest,
  UpdateClassRequest,
} from '@/api/classApi/types';
import { RequestEmit } from '@/api/tools';

export default class classApi {
  static getAllClasses: RequestDataEmmit<never, GetAllClassesResponse> = () => {
    return RequestEmit({
      method: 'GET',
      path: '/api/class/getAllClass',
    });
  };

  static getAllClassesWithPage: RequestDataEmmit<
    GetAllClassesWithPageRequest,
    GetAllClassesResponse
  > = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/class/getAllClassWithPage`,
      data,
    });
  };

  static addClass: RequestDataEmmit<AddClassRequest, string> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/class/addClass`,
      data,
    });
  };

  static updateClass: RequestDataEmmit<UpdateClassRequest, string> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/class/updateClass`,
      data,
    });
  };

  static deleteClass: RequestDataEmmit<{ id: number }, string> = (data) => {
    return RequestEmit({
      method: 'DELETE',
      path: `/api/class/deleteClass/:id`,
      data,
    });
  };
}
