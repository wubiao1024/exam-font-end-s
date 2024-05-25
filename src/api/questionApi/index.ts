import { RequestDataEmmit } from '@/api/const';
import {
  deleteQuestionRequest,
  Question,
  selectQuestionsRequest,
  selectQuestionsResponse,
} from '@/api/questionApi/const';
import { RequestEmit } from '@/api/tools';

/**
 * /api/question/selectQuestions
 *  分页获取查询问题
 */
export default class questionApi {
  // 分页查询
  public static getQuestions: RequestDataEmmit<selectQuestionsRequest, selectQuestionsResponse> = (
    data,
  ) => {
    return RequestEmit({
      method: 'POST',
      data,
      path: '/api/question/selectQuestions',
    });
  };
  // 删除问题
  public static deleteQuestionById: RequestDataEmmit<deleteQuestionRequest, any> = (data) => {
    return RequestEmit({
      method: 'DELETE',
      path: '/api/question/delete/:id',
      data,
    });
  };
  // 更新问题
  public static updateQuestion: RequestDataEmmit<Question, string> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: '/api/question/update',
      data,
    });
  };

  //  新增问题
  public static addQuestion: RequestDataEmmit<Question, string> = (data) => {
    return RequestEmit({
      method: 'PUT',
      path: '/api/question/add',
      data,
    });
  };
}
