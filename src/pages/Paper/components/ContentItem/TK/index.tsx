import { OnItemInputChangeParams } from '@/pages/Paper/components/ContentItem/type';
import { TKContentList } from '@/api/paperApi/types';
import styles from './index.module.less';
import { debounce } from 'lodash';
import { QuestionType } from '@/api/questionApi/const';
import { useCallback, useEffect, useState } from 'react';
import { ProFormTextArea } from '@ant-design/pro-components';
import { EMPTY_TEXT } from '../../../../../../config/global';
import TeacherMarker from '@/pages/Paper/components/TeacherMarker';

export type debounceInputParams = { newAnswer?: string; comment?: string; score?: number };

type TKItemProps = {
  onChange: (params: OnItemInputChangeParams) => void;
  questionItem: TKContentList;
  index: number;
  mode?: ModeType;
};

export default ({ onChange, questionItem, index, mode }: TKItemProps) => {
  const [newAnswer, setNewAnswer] = useState<string>();
  useEffect(() => {
    if (questionItem.answer) {
      setNewAnswer(questionItem.answer);
    }
  }, [questionItem]);

  const debounceInputChange = useCallback(
    debounce((data: debounceInputParams) => {
      onChange({
        id: questionItem?.questionId as number,
        questionType: questionItem?.questionType as QuestionType,
        ...data,
      });
    }, 100),
    [questionItem],
  );

  return (
    <div className={styles.container}>
      <p id={questionItem?.questionId?.toString()} className={styles.description}>
        {index}、{questionItem.description}({questionItem.questionScore}分)
      </p>
      {mode === 'history' ||
        (mode === 'mark' && <span style={{ color: 'black', fontSize: '18px' }}> 考生答案：</span>)}
      <ProFormTextArea
        placeholder="这里填写答案，鼠标悬浮右下角可以调整输入框的大小"
        fieldProps={{
          disabled: !!questionItem.correctAnswer,
          rows: 5,
          value: newAnswer,
          onChange: (e) => {
            let value = e.target.value as string;
            setNewAnswer(value);
            debounceInputChange({ newAnswer: value });
            debounceInputChange({ newAnswer: value });
          },
        }}
      />
      {mode === 'history' && (
        <>
          <p style={{ marginLeft: '10px' }}>教师评语：{questionItem?.comment || EMPTY_TEXT}</p>
          <p style={{ marginLeft: '10px' }}>我的得分：{questionItem?.score || EMPTY_TEXT}</p>
        </>
      )}
      <br />
      {mode === 'mark' && (
        <TeacherMarker
          id={questionItem?.questionId as number}
          debounceInputChange={debounceInputChange}
          defaultComment={questionItem?.comment}
          maxScore={questionItem.questionScore}
          defaultScore={questionItem.score}
        />
      )}
    </div>
  );
};
