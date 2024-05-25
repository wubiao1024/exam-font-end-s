import { OnItemInputChangeParams } from '@/pages/Paper/components/ContentItem/type';
import { XZContentList } from '@/api/paperApi/types';
import { Radio } from 'antd';
import { useEffect, useState } from 'react';
import { QuestionType } from '@/api/questionApi/const';
import styles from './index.module.less';
import CorrectComponent from '@/pages/Paper/components/ContentItem/CorrectComponent';

type XZItemProps = {
  onChange: (params: OnItemInputChangeParams) => void;
  questionItem: XZContentList;
  index: number;
};

const questionTypeArr = ['A', 'B', 'C', 'D'];

export default ({ onChange, questionItem, index }: XZItemProps) => {
  const [newAnswer, setNewAnswer] = useState<QuestionType | undefined>();

  useEffect(() => {
    if (questionItem?.answer) {
      setNewAnswer(questionItem.answer as QuestionType);
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
          const newAnswer = e.target.value as QuestionType;
          setNewAnswer(newAnswer);
          onChange({
            id: questionItem.questionId as number,
            questionType: questionItem?.questionType as QuestionType,
            newAnswer: newAnswer,
          });
        }}
      >
        {questionTypeArr.map((item, index) => (
          <>
            {' '}
            <Radio key={item} className={styles.radio} value={item}>
              {item}、{questionItem[item]}
            </Radio>
            {index < questionTypeArr.length - 1 && <br />}
          </>
        ))}
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
