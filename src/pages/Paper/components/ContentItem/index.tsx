import { Card } from 'antd';
import styles from './index.module.less';
import {
  ContentItemProps,
  OnItemInputChangeParams,
} from '@/pages/Paper/components/ContentItem/type';
import { lazy, Suspense, useCallback } from 'react';
import { QuestionType } from '@/api/questionApi/const';
import LoadingIcon from 'antd/es/button/LoadingIcon';

export default ({ onItemInputChange, questionList, title, mode }: ContentItemProps) => {
  const getQuestionItem = useCallback((type?: QuestionType) => {
    return !!type
      ? lazy(() => import(`./${type}/index`))
      : function () {
          return <LoadingIcon existIcon prefixCls={'加载中...'}></LoadingIcon>;
        };
  }, []);

  return (
    <Card className={styles.container}>
      <div className={styles.title}>{title}</div>
      {questionList &&
        questionList.map((item, index) => {
          const QuestionItem = getQuestionItem(item.questionType as QuestionType);
          return (
            <Suspense key={item.questionId} fallback={<div>Loading...</div>}>
              <QuestionItem
                mode={mode}
                onChange={(data: OnItemInputChangeParams) => {
                  onItemInputChange?.(data);
                }}
                questionItem={item}
                index={index + 1}
              ></QuestionItem>
            </Suspense>
          );
        })}
    </Card>
  );
};
