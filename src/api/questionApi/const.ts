import ExportMenu from 'rc-menu';

/**
 * /api/question/selectQuestions
 * Request
 */
export type QuestionType = 'XZ' | 'TK' | 'PD' | 'JD'; // XZ TK PD JD;
export interface selectQuestionsRequest {
  pageSize?: number | null;
  pageNo?: number | null;
  questionId?: number | null;
  subjectId?: number | null;
  questionType?: QuestionType;
  [property: string]: any;
}

/**
 * response
 */
export interface selectQuestionsResponse {
  listTotalCount: number;
  pageTotalCount: number;
  questions: Question[];
  [property: string]: any;
}

export interface Question {
  id?: number;
  level: number;
  questionScore: number;
  qAuto?: QAuto;
  qOperation?: QOperation;
  questionType: QuestionType;
  subjectEnglishName?: string;
  subjectId?: number;
  isAuto?: number;
  subjectName?: string;
  [property: string]: any;
}

export interface QAuto {
  A: string;
  answer: string;
  B: string;
  C: string;
  D: string;
  description: string;
  [property: string]: any;
}

export interface QOperation {
  answer: string;
  description: string;
  [property: string]: any;
}

/**
 * /api/question/delete/{id}
 */

export interface deleteQuestionRequest {
  id: number;
}

/**
 * /api/question/update
 */
export interface updateQuestionRequest {
  id: number;
  level: number;
  questionScore?: number;
  qAuto?: QAuto;
  qOperation?: QOperation;
  questionType: QuestionType;
  subjectId: number;
  [property: string]: any;
}
