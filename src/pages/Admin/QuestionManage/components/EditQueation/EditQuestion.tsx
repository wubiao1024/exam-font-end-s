import { useCallback, useEffect, useMemo, useState } from 'react';
import { Question, QuestionType } from '@/api/questionApi/const';
import { Button, Card, Input, Modal, Rate } from 'antd';
import { questionDetailTitleMap, questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import TextArea from 'antd/es/input/TextArea';
import Select from '@/pages/Admin/QuestionManage/components/Select/Select';
import { useQuestionMenuProps } from '@/pages/Admin/QuestionManage/hooks/useQuestionMenuProps';
import styles from './index.module.less';
import { flushSync } from 'react-dom';

import SubjectSelect from '@/pages/Admin/QuestionManage/components/TopBar/SubjectSelect';
import { questionMap } from '@/pages/Admin/QuestionManage/components/EditQueation/const';
import RichText from '@/pages/Paper/components/RichText';
import { calc } from 'antd/es/theme/internal';
type Props = {
  question?: Question;
  onOk: (question: Question | null | undefined) => any;
  onCancel?: () => void;
  onEdit?: () => void;
  isAdd: boolean;
  open: boolean;
};

export default ({ question, onCancel, onOk, open, isAdd }: Props) => {
  const [_question, set_Question] = useState<Question | null>();
  const [questionTypeSelectTitle, setQuestionTypeSelectTitle] = useState<string | undefined>(
    '请选择问题类型',
  );
  const [subjectName, setSubjectName] = useState<string | undefined>();

  const _onCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const qAuto = useMemo(() => {
    return _question?.qAuto;
  }, [_question]);

  const qOperation = useMemo(() => {
    return _question?.qOperation;
  }, [_question]);

  // 保存
  const _onOk = useCallback(() => {
    onOk(_question);
  }, [onOk, _question]);

  const getQAutoOrQOperation = useCallback((questionType: QuestionType) => {
    return ['XZ', 'PD'].includes(questionType) ? 'qAuto' : 'qOperation';
  }, []);

  const init_Question = useCallback(() => {
    // 编辑
    if (question && !isAdd) {
      set_Question(JSON.parse(JSON.stringify(question)));
      setSubjectName(question?.subjectName);
      setQuestionTypeSelectTitle(questionTypeMap[question.questionType]);
    }
    //  如果是新增，干掉_question，把_question初始化为指定的格式
    if (isAdd) {
      const newQuestion: Question = {
        questionType: 'JD',
        qOperation: questionMap.QOperation,
        level: 0,
        questionScore: 0,
        subjectId: undefined,
      };
      setQuestionTypeSelectTitle('简答');
      set_Question(newQuestion);
    }
  }, [isAdd, question]);

  // 初始化
  useEffect(() => {
    init_Question();
  }, []);

  const getJSX = useCallback(
    (
      key: keyof Record<string, string>,
      title?: keyof Record<string, string>,
      description?: string | undefined | number | null,
      questionType?: QuestionType,
    ) => {
      return (
        <div key={title} className={styles.flexContainer}>
          <span className={styles.first}>{title + ': '}</span>
          {typeof description === 'string' && questionType === 'JD' && key === 'answer' && (
            <RichText
              onChange={(value) => {
                if (_question) {
                  const newQuestion = JSON.parse(JSON.stringify(_question));
                  let qAutoOrQOperation = getQAutoOrQOperation(_question.questionType);
                  if (qAutoOrQOperation && key) {
                    newQuestion[qAutoOrQOperation][key] = value;
                    set_Question(newQuestion);
                  }
                }
              }}
              editorConfig={{ placeholder: '请输入答案' }}
              defaultHtml={description || ''}
              style={{ height: 200 }}
              width={'80%'}
            />
          )}

          {typeof description === 'string' && !(questionType === 'JD' && key === 'answer') && (
            <TextArea
              required
              className={styles.second}
              onChange={(e) => {
                if (_question) {
                  const newQuestion: Question = JSON.parse(JSON.stringify(_question));
                  let qAutoOrQOperation = getQAutoOrQOperation(_question.questionType);
                  if (qAutoOrQOperation && key) {
                    newQuestion[qAutoOrQOperation][key] = e.target.value;
                    set_Question(newQuestion);
                  }
                }
              }}
              value={description || ''}
            />
          )}
          {key === 'level' && (
            <Rate
              count={4}
              value={Number(description)}
              onChange={(e) => {
                flushSync(() => {
                  set_Question((prevState) => {
                    return Object.assign({}, prevState, { [key]: e });
                  });
                });
              }}
            />
          )}
          {typeof description === 'number' && key !== 'level' && (
            <Input
              type="number"
              className={styles.second}
              max={30}
              min={1}
              defaultValue={0}
              value={description as number}
              onChange={(e) => {
                set_Question((prevState) => {
                  return Object.assign({}, prevState, { [key]: Number(e.target.value) });
                });
              }}
            />
          )}
        </div>
      );
    },
    [_question],
  );

  const modalConfirm = useCallback((_onOk: () => void) => {
    Modal.confirm({
      type: 'warning',
      title: '更新题型将导致已经填写的表单丢失，确定更换？',
      onOk: () => {
        _onOk();
      },
      okText: '确定更换',
      cancelText: '取消',
    });
  }, []);

  const questionTypeChangeCb = (e: any) => {
    //不是自身切换自身
    if (_question?.questionType !== e.key) {
      modalConfirm?.(() => {
        // 删除原始的属性
        if (_question?.qAuto) {
          delete _question.qAuto;
        }
        if (_question?.qOperation) {
          delete _question.qOperation;
        }
        const newQuestion = JSON.parse(JSON.stringify(_question));

        // 获取问题的类型
        let qAutoOrQOperation = getQAutoOrQOperation(e.key as QuestionType);
        if (qAutoOrQOperation === 'qOperation') {
          newQuestion[qAutoOrQOperation] = questionMap.QOperation;
        }
        if (qAutoOrQOperation === 'qAuto') {
          newQuestion[qAutoOrQOperation] = questionMap[e.key as 'XZ' | 'PD'];
        }
        // 新的类型
        newQuestion.questionType = e.key;
        set_Question(newQuestion);
        // 顶部标题切换
        setQuestionTypeSelectTitle(questionTypeMap[e.key]);
      });
    }
  };

  const getQuestionDisplay = useCallback(() => {
    return (
      <Card>
        <div className={styles.flexContainer}>
          <span className={styles.first}>问题类型: </span>
          <Select
            selectTitle={questionTypeSelectTitle || '请选择问题类型'}
            // TODO
            DropDownProps={{ menu: useQuestionMenuProps(questionTypeChangeCb), arrow: true }}
            ButtonProps={{ className: styles.second }}
          />
        </div>

        <div className={styles.flexContainer}>
          <span className={styles.first}>学科类型: </span>
          <SubjectSelect
            ButtonProps={{
              className: styles.second,
            }}
            subjectName={subjectName || '请选择学科类型'}
            onItemClick={(subjectId, subjectTitle) => {
              set_Question((prevState) =>
                Object.assign({}, prevState, { subjectId, subjectName: subjectTitle }),
              );
              setSubjectName(subjectTitle);
            }}
          />
        </div>

        {qAuto &&
          Object.entries(qAuto).map(
            ([key, value]) =>
              Object.keys(questionDetailTitleMap).includes(key) &&
              getJSX(key, questionDetailTitleMap[key], value, _question?.questionType),
          )}
        {qOperation &&
          Object.entries(qOperation).map(
            ([key, value]) =>
              Object.keys(questionDetailTitleMap).includes(key) &&
              getJSX(key, questionDetailTitleMap[key], value, _question?.questionType),
          )}
        {getJSX(
          'level',
          questionDetailTitleMap.level,
          _question && _question.level,
          _question?.questionType,
        )}
        {getJSX(
          'questionScore',
          questionDetailTitleMap.questionScore,
          _question && _question.questionScore,
          _question?.questionType,
        )}
      </Card>
    );
  }, [_question, questionTypeSelectTitle]);

  return (
    <Modal
      destroyOnClose
      forceRender
      closable={false}
      okText={isAdd ? '新增' : '更新'}
      className={styles.model}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>题目详情</h2>
          {!isAdd && (
            <Button
              type="primary"
              onClick={() => {
                // reset
                const newQuestion: Question = JSON.parse(JSON.stringify(question));
                set_Question(newQuestion);
                setSubjectName(newQuestion.subjectName);
                setQuestionTypeSelectTitle(questionTypeMap[newQuestion.questionType]);
              }}
            >
              重置
            </Button>
          )}
        </div>
      }
      open={open}
      onOk={_onOk}
      onCancel={_onCancel}
      width={'70%'}
      afterOpenChange={(_open) => {
        if (open) {
          init_Question();
        } else {
          setQuestionTypeSelectTitle(undefined);
          setSubjectName(undefined);
          set_Question(null);
        }
      }}
    >
      {getQuestionDisplay()}
    </Modal>
  );
};
