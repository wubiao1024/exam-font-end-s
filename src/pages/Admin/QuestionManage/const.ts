export type questionType = 'XZ' | 'TK' | 'PD' | 'JD';
export const questionTypeMap: Record<questionType | string, string> = {
  XZ: '选择',
  PD: '判断',
  TK: '填空',
  JD: '简答',
};

export const IndexMap: Record<number, string> = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
};

export const questionDetailTitleMap: typeof questionTypeMap = {
  description: '题目描述',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  answer: '参考答案',
  questionScore: '题目分数',
  level: '难度',
  subjectName: '学科类型',
  subjectType: '问题类型',
};
