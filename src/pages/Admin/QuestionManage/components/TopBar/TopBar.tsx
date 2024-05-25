import { Button, Dropdown, MenuProps, Space, Spin } from 'antd';
import { DownOutlined, LoadingOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from './index.module.less';
import { questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useQuestionMenuProps } from '@/pages/Admin/QuestionManage/hooks/useQuestionMenuProps';
import { QuestionType } from '@/api/questionApi/const';
import SubjectSelect from '@/pages/Admin/QuestionManage/components/TopBar/SubjectSelect';

type Props = {
  onSearchClick?: (data: {
    questionId: any;
    questionType: QuestionType | undefined;
    subjectId: number | undefined;
  }) => void;
  onAddClick?: () => void;
  refresh?: () => void;
  loading?: boolean;
  showSubjectSelect?: boolean;
};

export default ({ onSearchClick, onAddClick, refresh, loading, showSubjectSelect }: Props) => {
  const [subjectId, setSubjectId] = useState<number>();
  const [questionId, setQuestionId] = useState<number>();
  const [questionType, setQuestionType] = useState<QuestionType | any>();
  const [subjectTitle, setSubjectTitle] = useState<string | undefined>();

  const questionTypeProps = useQuestionMenuProps((e: MenuInfo) => {
    setQuestionType(Object.keys(questionTypeMap).includes(e.key) ? e.key : '');
  });

  // 点击执行
  const handSearchClick = () => {
    const _questionType = Object.keys(questionTypeMap).includes(questionType)
      ? questionType
      : undefined;
    onSearchClick?.({ questionId, subjectId, questionType: _questionType });
  };

  return (
    <div className={styles.container}>
      <Dropdown menu={questionTypeProps} arrow={true}>
        <Button className={styles.select}>
          <Space>
            {questionTypeMap[questionType] || '请选择问题类型'}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
      {showSubjectSelect && (
        <SubjectSelect
          onItemClick={(subjectId, subjectTitle) => {
            setSubjectId(subjectId);
            setSubjectTitle(subjectTitle);
          }}
          subjectName={subjectTitle}
        />
      )}

      <input
        className={styles.idInput}
        placeholder={'请输入问题id'}
        type={'number'}
        onChange={(e) => {
          setQuestionId(+e.target.value);
        }}
      />
      <div className={styles.search}>
        <Button
          type={'primary'}
          loading={loading}
          icon={<SearchOutlined />}
          onClick={handSearchClick}
        >
          搜索
        </Button>
        {loading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: '24px',
                }}
                spin={false}
              />
            }
          />
        ) : (
          <span
            onClick={() => {
              refresh?.();
            }}
          >
            <svg className={'icon'}>
              <use xlinkHref="#icon-shuaxin" />
            </svg>
          </span>
        )}
      </div>

      <Button
        className={styles.add}
        type="primary"
        onClick={() => {
          onAddClick?.();
        }}
        icon={<PlusOutlined />}
      >
        新增试题
      </Button>
    </div>
  );
};
