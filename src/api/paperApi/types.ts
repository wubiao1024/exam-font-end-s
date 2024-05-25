export interface PaperInfo {
  description?: string;
  id?: number;
  subjectId: number;
  subjectName: string;
  title: string;
  totalScore?: number;
  examDuration: number;
  startTime: number;
}
export type Paper = {
  paper: PaperInfo;
  questionIds?: number[];
  // 考前需知
  preamble?: string;
};
export interface GetPapersResponse {
  listTotalCount: number;
  pageTotalCount: number;
  papers: Paper[];
  [property: string]: any;
}

export interface GetQuestionInfoByIdsResponse {
  totalCount: number;
  totalScore: number;
  JD: Jd;
  PD: PD;
  TK: Tk;
  XZ: Xz;
}

export interface Jd {
  contentList: JDContentList[];
  totalCount: number;
  totalScore: number;
  [property: string]: any;
}

export interface JDContentList {
  answer?: string;
  correctAnswer?: string;
  description?: string;
  level?: number;
  questionId?: number;
  questionScore?: number;
  questionType?: string;
  // 教师评语
  comment?: string;
  // 教师评分
  score?: number;
  [property: string]: any;
}

export interface PD {
  contentList: PDContentList[];
  totalCount: number;
  totalScore: number;
  [property: string]: any;
}

export interface PDContentList {
  A?: string;
  answer?: string;
  correctAnswer?: string;
  B?: string;
  description?: string;
  level?: number;
  questionId?: number;
  questionScore?: number;
  questionType?: string;
  // 教师评语
  comment?: string;
  // 教师评分
  score?: number;
  [property: string]: any;
}

export interface Tk {
  contentList: TKContentList[];
  totalCount: number;
  totalScore: number;
  [property: string]: any;
}

export interface TKContentList {
  answer?: string;
  correctAnswer?: string;
  description?: string;
  level?: number;
  questionId?: number;
  questionScore?: number;
  questionType?: string;
  // 教师评语
  comment?: string;
  // 教师评分
  score?: number;
  [property: string]: any;
}

export interface Xz {
  contentList: XZContentList[];
  totalCount: number;
  totalScore: number;
  [property: string]: any;
}

export interface XZContentList {
  A?: string;
  answer?: string;
  correctAnswer?: string;
  B?: string;
  C?: string;
  D?: string;
  description?: string;
  level?: number;
  questionId?: number;
  questionScore?: number;
  questionType?: string;
  // 教师评语
  comment?: string;
  // 教师评分
  score?: number;
  [property: string]: any;
}
