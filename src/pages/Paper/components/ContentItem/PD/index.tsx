import { OnItemInputChangeParams } from '@/pages/Paper/components/ContentItem/type';
import { PDContentList } from '@/api/paperApi/types';
import { Radio } from 'antd';
import { useEffect, useState } from 'react';
import { QuestionType } from '@/api/questionApi/const';
import styles from './index.module.less';
import CorrectComponent from '@/pages/Paper/components/ContentItem/CorrectComponent';

type PDItemProps = {
  onChange: (params: OnItemInputChangeParams) => void;
  questionItem: PDContentList;
  index: number;
};

export default ({ onChange, questionItem, index }: PDItemProps) => {
  const [newAnswer, setNewAnswer] = useState<'A' | 'B' | undefined>();

  useEffect(() => {
    if (questionItem?.answer) {
      setNewAnswer(questionItem.answer as 'A' | 'B');
    }
  }, [questionItem]);
  return (
    <div className={styles.container}>
      <p id={questionItem?.questionId?.toString()} className={styles.description}>
        {index}、{questionItem.description}({questionItem.questionScore}分)
      </p>
      <Radio.Group
        disabled={!!questionItem.correctAnswer}
        className={styles.answer}
        value={newAnswer}
        onChange={(e) => {
          const newAnswer = e.target.value as 'A' | 'B';
          setNewAnswer(newAnswer);
          onChange({
            id: questionItem.questionId as number,
            questionType: questionItem?.questionType as QuestionType,
            newAnswer: newAnswer,
          });
        }}
      >
        <Radio className={styles.radio} value="A">
          A、{questionItem.A}
        </Radio>
        <br />
        <Radio value={'B'} className={styles.radio}>
          B、{questionItem.B}
        </Radio>
      </Radio.Group>
      {questionItem?.correctAnswer && (
        <CorrectComponent
          correctAnswer={questionItem.correctAnswer}
          answer={questionItem.answer || ''}
        />
      )}
    </div>
  );
};
