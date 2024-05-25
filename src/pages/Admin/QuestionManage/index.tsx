import TopBar from '@/pages/Admin/QuestionManage/components/TopBar/TopBar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Question, selectQuestionsRequest, selectQuestionsResponse } from '@/api/questionApi/const';
import { Button, message, Modal, Pagination, Rate, Table, TableProps } from 'antd';
import styles from './index.module.less';
import { questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import { EMPTY_TEXT } from '../../../../config/global';
import questionApi from '@/api/questionApi';
import { useRequest } from '@@/exports';
import { flushSync } from 'react-dom';
import EditQuestion from '@/pages/Admin/QuestionManage/components/EditQueation/EditQuestion';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default () => {
  const [questions, setQuestions] = useState<selectQuestionsResponse['questions'] | undefined>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [total, setTotal] = useState<number>(0);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [question, setQuestion] = useState<Question | undefined>();
  const [isAdd, setIsAdd] = useState<boolean>(false);

  const handleDetail = (_question: Question) => {
    setIsAdd(false);
    setModelIsOpen(true);
    setQuestion(_question);
  };

  const {
    run: getQuestions,
    refresh,
    loading,
  } = useRequest(questionApi.getQuestions, {
    manual: true,
    onSuccess(res) {
      setTotal(res.listTotalCount);
      setQuestions(res.questions);
      // message.success('成功');
    },
  });

  const getQuestionsEmit = useCallback(
    (data: selectQuestionsRequest) => {
      getQuestions({ ...data, questionId: data.questionId === 0 ? undefined : data.questionId });
    },
    [pageSize, pageNo],
  );

  const handleDelete = (record: Question) => {
    Modal.confirm({
      content: `确定删除id为--${record.id}-- 的问题吗？`,
      onOk: () => {
        questionApi.deleteQuestionById({ id: record.id as number }).then((res: any) => {
          if (res.success) {
            message.success(res.message);
            refresh?.();
          }
        });
      },
    });
  };

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

  const columns = useMemo<TableProps['columns']>(() => {
    // let index = 0;
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
            &nbsp;&nbsp;
            <Button
              onClick={() => {
                handleDelete(record);
              }}
              danger
              type={'default'}
              icon={<DeleteOutlined />}
            >
              删除
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
        showSubjectSelect={true}
        loading={loading}
        refresh={refresh}
        onSearchClick={(data) => {
          getQuestionsEmit({ pageNo, pageSize, ...data });
        }}
        onAddClick={() => {
          flushSync(() => {
            setIsAdd(true);
          });
          setModelIsOpen(true);
        }}
      />
      <Table dataSource={dataSource} columns={columns} pagination={false} />
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
            }
          } else {
            // 如果是新增
            const res = await questionApi.addQuestion(e as Question);
            // @ts-ignore
            if (res.success) {
              message.success('增加成功');
              setModelIsOpen(false);
              refresh?.();
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
