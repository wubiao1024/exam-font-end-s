import styles from './index.module.less';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Pagination, PaginationProps } from 'antd';
import { ProFormSelect } from '@ant-design/pro-components';
import { useGetSubjects } from '@/pages/Admin/PaperManage/hooks/useGetSubjects';
import { useRequest } from '@@/exports';
import { localURL } from '../../../../config/global';
import examApi from '@/api/examApi';
import { ExamRecordsHistory, GetHistoryExamRecordsResponse } from '@/api/examApi/types';
import PaperItem from '@/pages/Student/HistoryExam/PaperItem';
import { STATUS_MAP } from '@/pages/Student/HistoryExam/PaperItem/const';

export default () => {
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const [status, setStatus] = useState<number>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [listTotalCount, setListTotalCount] = useState<number>(0);

  const { data: historyExamRecordsData, run: getExamRecords } = useRequest(
    examApi.getHistoryExamRecords,
    {
      manual: false,
      defaultParams: [{ subjectId, pageNo, pageSize, status }],
      onSuccess: (data: any) => {
        if (!!data) {
          setListTotalCount(data.listTotalCount);
        }
      },
    },
  );

  useEffect(() => {
    getExamRecords({ subjectId, pageNo, pageSize, status });
  }, [pageNo, pageSize]);

  // 读取exams
  const exams: ExamRecordsHistory[] = useMemo(() => {
    return (historyExamRecordsData as GetHistoryExamRecordsResponse)?.examRecordsHistoryList || [];
  }, [historyExamRecordsData]);

  const onChange: PaginationProps['onChange'] = useCallback((pageNo: number, pageSize: number) => {
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <span className={styles.label}>所属学科：</span>
        <ProFormSelect
          className={styles.select}
          name={'subjectId'}
          onChange={(subjectId: number) => {
            setSubjectId(subjectId);
          }}
          placeholder="请选择所属学科"
          request={useGetSubjects?.()}
          debounceTime={300}
        />
        <span className={styles.label}>考试状态：</span>
        <ProFormSelect
          className={styles.select}
          name={'status'}
          placeholder={'请选择考试状态'}
          debounceTime={300}
          onChange={(status: number) => {
            setStatus(status);
          }}
          options={Object.entries(STATUS_MAP).map(([key, value]) => {
            return {
              label: value,
              key: Number(key),
              value: Number(key),
            };
          })}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className={styles.button}
          onClick={() => {
            getExamRecords({ subjectId, pageNo, pageSize, status });
          }}
        >
          搜索
        </Button>
      </div>
      <div className={styles.display}>
        {exams.map((item) => {
          console.log();
          return (
            <PaperItem
              onDetailClick={() => {
                window.open(`${localURL}/Paper/ExamDetail/${item.paperId}/${item.id}`);
              }}
              styleClassName={styles.item}
              {...item}
              key={item?.id}
            />
          );
        })}
      </div>
      <div className={styles.pageNation}>
        <Pagination
          style={{ margin: '0 auto' }}
          onChange={onChange}
          total={listTotalCount}
          current={pageNo}
          pageSize={pageSize}
          pageSizeOptions={[6, 9, 12]}
          showQuickJumper
          showSizeChanger
          showTotal={(total) => `共 ${total} 条`}
        ></Pagination>
      </div>
    </div>
  );
};
