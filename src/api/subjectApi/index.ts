import { RequestEmit } from '@/api/tools';
import { getAllSubjectResponse } from '@/api/subjectApi/const';
import { RequestDataEmmit } from '@/api/const';
import { Paper } from '@/api/paperApi/types';

export default class subjectApi {
  public static getAllSubject: RequestDataEmmit<never, getAllSubjectResponse> = () => {
    return RequestEmit({
      method: 'GET',
      path: '/api/subject/getAllSubject',
    });
  };

  static getPaperById: RequestDataEmmit<{ id: number }, Paper> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: '/api/subject/getPaperById',
      data,
    });
  };
}
