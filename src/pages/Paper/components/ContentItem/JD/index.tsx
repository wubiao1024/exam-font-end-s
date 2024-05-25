import { ModeType, OnItemInputChangeParams } from '@/pages/Paper/components/ContentItem/type';
import { JDContentList } from '@/api/paperApi/types';
import styles from './index.module.less';
import RichText from '@/pages/Paper/components/RichText';
import { debounce } from 'lodash';
import { QuestionType } from '@/api/questionApi/const';
import { useCallback } from 'react';
import { EMPTY_TEXT } from '../../../../../../config/global';
import TeacherMarker from '@/pages/Paper/components/TeacherMarker';
import { debounceInputParams } from '@/pages/Paper/components/ContentItem/TK';

type JDItemProps = {
  onChange: (params: OnItemInputChangeParams) => void;
  questionItem: JDContentList;
  index: number;
  mode: ModeType;
};

export default ({ onChange, questionItem, index, mode }: JDItemProps) => {
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

      {mode === 'mark' || mode === 'history' ? (
        <>
          <span style={{ color: 'black', fontSize: '18px' }}> 考生答案：</span>
          <RichText
            style={{ height: 'fit-content', minHeight: '100px' }}
            onChange={(newAnswer: string) => {
              debounceInputChange({ newAnswer });
            }}
            placeholder={'考生答案'}
            disabled={true}
            defaultHtml={questionItem.answer || ''}
          />
          <p>
            <br />
            <span style={{ color: 'green', fontSize: '18px' }}> 参考答案：</span>
            <RichText
              style={{ height: 'fit-content', minHeight: '100px' }}
              toolbarConfig={{
                toolbarKeys: [],
              }}
              disabled={!!questionItem.correctAnswer}
              defaultHtml={questionItem.correctAnswer || ''}
            />
          </p>
        </>
      ) : (
        <>
          <RichText
            style={{ height: 'fit-content', minHeight: '500px' }}
            onChange={(newAnswer: string) => {
              debounceInputChange({ newAnswer });
            }}
            placeholder={'请作答'}
            defaultHtml={questionItem.answer || ''}
          />
        </>
      )}

      {
        <>
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
              defaultScore={questionItem.score}
              debounceInputChange={debounceInputChange}
              defaultComment={questionItem?.comment}
              maxScore={questionItem.questionScore}
            />
          )}
        </>
      }
    </div>
  );
};
