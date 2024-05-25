import { GetQuestionInfoByIdsResponse } from '@/api/paperApi/types';

type QuestionType = 'XZ' | 'TK' | 'PD' | 'JD'; // XZ选择 TK填空 PD判断 JD简答;
type valueOf<T> = T[keyof T]; // 获取类型T的value的类型组成联合类型

export type OnItemInputChangeParams = {
  id: number;
  questionType: QuestionType;
  newAnswer?: string;
  comment?: string;
  score?: number;
};
export type ModeType = 'history' | 'answer' | 'mark';

export interface ContentItemProps {
  onItemInputChange?: (params: OnItemInputChangeParams) => void;
  title?: string;
  questionList?: valueOf<Pick<GetQuestionInfoByIdsResponse, QuestionType>>['contentList'];
  mode?: ModeType;
}
