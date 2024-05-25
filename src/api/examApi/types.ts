/**
 * Result«String»
 */
export type Response = {
  code?: number | null;
  data?: any;
  message?: null | string;
  success?: boolean | null;
  [property: string]: any;
};

export type PublishExamRequest = {
  /**
   * 考试时长
   * */
  duration?: number;
  paperId?: number;
  /**
   * 考试开始时间
   */
  startTime?: string;
  studentIds?: number[];
  [property: string]: any;
};

export type GetExamRecordsResponse = {
  examRecordsHistory: ExamRecordsHistory[];
  examRecordsTODOList: ExamRecordsTODOList[];
  [property: string]: any;
};

export type GetHistoryExamRecordsResponse = {
  pageTotalCount: number;
  listTotalCount: number;
  current: number;
  pageSize: number;
  examRecordsHistoryList: ExamRecordsHistory[];
};

export type ExamRecordsHistory = {
  description?: string;
  duration?: number;
  id?: number;
  paperId?: number;
  startTime?: string;
  correctRate?: number; // 正确率
  status?: number;
  title?: string;
  subjectName: string;
  score: number;
  totalScore?: number;
  [property: string]: any;
};

export type ExamRecordsTODOList = {
  description: string;
  duration: number;
  id: number;
  paperId: number;
  startTime: string;
  title: string;
  totalScore: number;
  subjectName: string;
  [property: string]: any;
};

export type SavaAnswersRequest = {
  answer?: string;
  examRecordId?: number;
  questionId?: number;
  [property: string]: any;
};

export type MarkQuestionRequest = {
  comment?: string;
  examRecordId?: number;
  questionId?: number;
  score?: number;
  [property: string]: any;
};
