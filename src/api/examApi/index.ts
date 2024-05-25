import { RequestDataEmmit } from '@/api/const';

import { RequestEmit } from '@/api/tools';
import {
  ExamRecordsHistory,
  ExamRecordsTODOList,
  GetExamRecordsResponse,
  GetHistoryExamRecordsResponse,
  MarkQuestionRequest,
  PublishExamRequest,
  Response,
  SavaAnswersRequest,
} from '@/api/examApi/types';

export default class examApi {
  static publishExam: RequestDataEmmit<PublishExamRequest, Response> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/examRecord/publishExam`,
      data,
    });
  };

  static getExamRecords: RequestDataEmmit<never, GetExamRecordsResponse> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/examRecord/getExamRecords`,
      data,
    });
  };

  static getHistoryExamRecords: RequestDataEmmit<
    { subjectId?: number; pageNo: number; pageSize: number; status?: number },
    GetHistoryExamRecordsResponse
  > = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/examRecord/getHistoryExamRecords`,
      data,
    });
  };

  static getMarkExamRecords: RequestDataEmmit<
    {
      subjectId?: number;
      pageNo: number;
      pageSize: number;
      status?: number;
      studentName?: string;
      classId?: number;
    },
    GetHistoryExamRecordsResponse
  > = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/examRecord/getMarkExamRecords`,
      data,
    });
  };

  static getStatisticsExamRecords: RequestDataEmmit<
    {
      subjectId?: number;
      pageNo: number;
      pageSize: number;
      status?: number;
      studentName?: string;
      classId?: number;
    },
    GetHistoryExamRecordsResponse
  > = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/examRecord/getStatisticsExamRecords`,
      data,
    });
  };

  static getExamRecordTODOById: RequestDataEmmit<{ id: number }, ExamRecordsTODOList> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/examRecord/getExamRecordTODOById/:id`,
      data,
    });
  };

  static generatorRecords: RequestDataEmmit<{ id: number }, Response> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/studentAnswer/generatorRecords/:id`,
      data,
    });
  };
  static savaAnswer: RequestDataEmmit<SavaAnswersRequest, Response> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/studentAnswer/saveAnswer`,
      data,
    });
  };
  static markQuestion: RequestDataEmmit<MarkQuestionRequest, Response> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/studentAnswer/markQuestion`,
      data,
    });
  };

  static submitExam: RequestDataEmmit<{ examRecordId: number }, Response> = (data) => {
    return RequestEmit({
      method: 'POST',
      path: `/api/examRecord/submitExam/:examRecordId`,
      data,
    });
  };

  static getExamFinished: RequestDataEmmit<{ examRecordId: number }, Response> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/examRecord/isExamFinished/:examRecordId`,
      data,
    });
  };
  static readPreamble: RequestDataEmmit<{ examRecordId: number }, Response> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/examRecord/readPreamble/:examRecordId`,
      data,
    });
  };
  static getIsReadPreamble: RequestDataEmmit<{ examRecordId: number }, Response> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/examRecord/getIsReadPreamble/:examRecordId`,
      data,
    });
  };

  static markFinished: RequestDataEmmit<{ examRecordId: number }, Response> = (data) => {
    return RequestEmit({
      method: 'GET',
      path: `/api/examRecord/markFinished/:examRecordId`,
      data,
    });
  };
}
