import { ProFormDigit, ProFormTextArea } from '@ant-design/pro-components';
import { useEffect, useRef, useState } from 'react';
type Props = {
  maxScore?: number;
  defaultComment?: string;
  debounceInputChange: (data: { comment?: string; score?: number }) => void;
  defaultScore?: number;
  id: number;
};

export default ({ maxScore, defaultComment, debounceInputChange, defaultScore, id }: Props) => {
  const [comment, setComment] = useState<string>();
  const [score, setScore] = useState<number>();

  return (
    <>
      <ProFormDigit
        rules={[{ required: true, message: '请批阅' }]}
        name={`${id}-score`}
        max={maxScore}
        label={`打分(共${maxScore}分)`}
        fieldProps={{
          defaultValue: defaultScore,
          changeOnWheel: false,
          onChange: (e: any) => {
            setScore(e);
            debounceInputChange({
              comment: comment,
              score: e,
            });
          },
        }}
      />
      <ProFormTextArea
        name={`${id}-comment`}
        fieldProps={{
          defaultValue: defaultComment,
          onChange: (e) => {
            setComment(e.target.value);
            console.log(e.target.value);
            debounceInputChange({
              comment: e.target.value,
              score: score,
            });
          },
        }}
        label={'评语'}
        placeholder={'请输入评语'}
      />
      <br />
    </>
  );
};
