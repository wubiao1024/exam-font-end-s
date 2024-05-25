import { RequestEmit } from '@/api/tools';
import { RequestDataEmmit, ResponseData } from '@/api/const';
import { GetPapersResponse, GetQuestionInfoByIdsResponse, Paper } from '@/api/paperApi/types';

export default class paperApi {
  // 根据id获取试卷
  public static getPaperById: RequestDataEmmit<{ id: number }, Paper> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/paper/getPaperById/:id`,
      data,
    });
  };

  // 分页查询试卷
  public static getPapers: RequestDataEmmit<
    { pageNo: number; pageSize: number; subjectId?: number },
    GetPapersResponse
  > = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/paper/getPapers`,
      data,
    });
  };

  //  添加试卷
  public static addPaper: RequestDataEmmit<Paper, ResponseData> = (data) => {
    return RequestEmit({
      method: 'PUT',
      path: `/api/paper/add`,
      data,
    });
  };

  //  修改试卷
  public static updatePaper: RequestDataEmmit<Paper, ResponseData> = (data) => {
    return RequestEmit({
      method: 'PUT',
      path: `/api/paper/update`,
      data,
    });
  };

  //  删除试卷
  public static deletePaper: RequestDataEmmit<{ id: number }, ResponseData> = (data) => {
    return RequestEmit({
      method: 'DELETE',
      path: `/api/paper/delete/:id`,
      data,
    });
  };

  // 根据questionIds获取问题总分
  public static getQuestionTotalScore: RequestDataEmmit<number[], ResponseData> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/paper/getQuestionTotalScore`,
      data,
    });
  };

  static getQuestionInfoByIds: RequestDataEmmit<number[], GetQuestionInfoByIdsResponse> = (
    data,
  ) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/question/getQuestionInfoByIds`,
      data,
    });
  };

  static getQuestionInfoByExamRecordId: RequestDataEmmit<
    { examRecordId: number },
    GetQuestionInfoByIdsResponse
  > = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/question/getQuestionInfoByExamRecordId/:examRecordId`,
      data,
    });
  };

  static getQuestionInfoByExamRecordIdWithCorrectAnswer: RequestDataEmmit<
    { examRecordId: number },
    GetQuestionInfoByIdsResponse
  > = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/question/getQuestionInfoByExamRecordIdWithCorrectAnswer/:examRecordId`,
      data,
    });
  };
}
