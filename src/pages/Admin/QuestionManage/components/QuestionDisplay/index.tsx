import TopBar from '@/pages/Admin/QuestionManage/components/TopBar/TopBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Question,
  QuestionType,
  selectQuestionsRequest,
  selectQuestionsResponse,
} from '@/api/questionApi/const';
import { Button, message, Pagination, Rate, Table, TableProps } from 'antd';
import styles from './index.module.less';
import { questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import questionApi from '@/api/questionApi';
import { useRequest } from '@@/exports';
import { flushSync } from 'react-dom';
import EditQuestion from '@/pages/Admin/QuestionManage/components/EditQueation/EditQuestion';
import { EditOutlined } from '@ant-design/icons';
import { EMPTY_TEXT } from '../../../../../../config/global';

type props = {
  onQuestionIdsChanged?: (questionIds: number[] | undefined) => void;
  showSelectQuestions?: boolean;
  subjectId?: number | undefined;
  questionIds?: number[] | undefined;
};
export default ({ onQuestionIdsChanged, showSelectQuestions, subjectId, questionIds }: props) => {
  const [questions, setQuestions] = useState<selectQuestionsResponse['questions'] | undefined>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [total, setTotal] = useState<number>(0);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  // 自定义一个subjectId
  const [_subjectId, set_SubjectId] = useState<number | undefined>();
  const [question, setQuestion] = useState<Question | undefined>();
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const [questionType, setQuestionType] = useState<QuestionType>();
  const [questionId, setQuestionId] = useState<number>();
  const [_questionIds, set_QuestionIds] = useState<number[]>();

  const {
    run: getQuestions,
    refresh,
    loading,
  } = useRequest(questionApi.getQuestions, {
    manual: true,
    onSuccess(res) {
      setTotal(res.listTotalCount);
      setQuestions(res.questions);
    },
  });

  const getQuestionsEmit = useCallback(
    (data: selectQuestionsRequest) => {
      getQuestions({
        subjectId: _subjectId,
        questionType,
        pageNo,
        pageSize,
        questionId: questionId === 0 ? undefined : questionId,
        ...data,
      });
    },
    [_subjectId, questionType, questionId],
  );

  useEffect(() => {
    flushSync(() => {
      set_SubjectId(subjectId);
      set_QuestionIds(questionIds);
    });
    getQuestionsEmit({ subjectId });
  }, []);

  const dataSource = useMemo<TableProps['dataSource']>(() => {
    return questions?.reduce((pre, cur) => {
      return [
        ...pre,
        {
          ...cur,
          key: cur.id,
        },
      ];
    }, [] as any);
  }, [questions]);

  const handleDetail = (_question: Question) => {
    setIsAdd(false);
    setModelIsOpen(true);
    setQuestion(_question);
  };

  const columns = useMemo<TableProps['columns']>(() => {
    return [
      {
        title: '问题id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '问题类型',
        dataIndex: 'questionType',
        render: (text) => {
          return questionTypeMap?.[text] || EMPTY_TEXT;
        },
        key: 'questionType',
      },
      {
        title: '所属学科',
        dataIndex: 'subjectName',
        key: 'subjectName',
      },
      {
        title: '难度',
        dataIndex: 'level',
        render: (text) => <Rate disabled defaultValue={text} count={4} />,
        key: 'level',
      },
      {
        title: '分数',
        dataIndex: 'questionScore',
        key: 'questionScore',
      },
      {
        title: '操作',
        key: 'operation',
        render: (_, record) => (
          <div>
            <Button
              onClick={() => {
                handleDetail(record);
              }}
              type={'default'}
              icon={<EditOutlined />}
            >
              编辑
            </Button>
          </div>
        ),
      },
    ];
  }, [questions]);

  const onChange = (pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  };

  const handleCancel = () => {
    setQuestion(undefined);
    setModelIsOpen(false);
  };

  useEffect(() => {
    getQuestionsEmit({ pageSize, pageNo });
  }, [pageSize, pageNo]);

  useEffect(() => {
    // 修复bug
    if (total < pageSize) {
      setPageNo(1);
    }
  }, [total]);

  return (
    <div>
      <TopBar
        loading={loading}
        refresh={refresh}
        // subjectId 由传进来的subjectId决定
        onSearchClick={({ questionId, questionType }) => {
          setQuestionId(questionId);
          setQuestionType(questionType);
          getQuestionsEmit({
            pageNo,
            pageSize,
            questionType,
            questionId: questionId === 0 ? undefined : questionId,
          });
        }}
        onAddClick={() => {
          flushSync(() => {
            setIsAdd(true);
          });
          setModelIsOpen(true);
        }}
      />
      {showSelectQuestions ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys: React.Key[]) => {
              set_QuestionIds(selectedRowKeys as number[]);
              onQuestionIdsChanged?.(selectedRowKeys as number[]);
            },
            selectedRowKeys: _questionIds,
          }}
        />
      ) : (
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      )}
      <div className={styles.pageNation}>
        <Pagination
          style={{ margin: '0 auto' }}
          onChange={onChange}
          total={total}
          current={pageNo}
          pageSize={pageSize}
          pageSizeOptions={[6, 8, 10]}
          showQuickJumper
          showSizeChanger
          showTotal={(total) => `共 ${total} 条`}
        ></Pagination>
      </div>
      <EditQuestion
        open={modelIsOpen}
        onOk={async (e) => {
          //  如果是编辑
          if (!isAdd) {
            const res = await questionApi.updateQuestion(e as Question);
            // @ts-ignore
            if (res.success) {
              message.success('更新成功');
              setModelIsOpen(false);
              refresh?.();
              // getQuestionsEmit({ pageNo, pageSize });
            }
          } else {
            // 如果是新增
            const res = await questionApi.addQuestion(e as Question);
            // @ts-ignore
            if (res.success) {
              message.success('增加成功');
              setModelIsOpen(false);
              refresh?.();
              // getQuestionsEmit({ pageNo, pageSize });
            }
          }
        }}
        onCancel={handleCancel}
        question={isAdd ? undefined : question}
        isAdd={isAdd}
      ></EditQuestion>
    </div>
  );
};
