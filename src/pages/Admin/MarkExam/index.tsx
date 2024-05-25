import styles from './index.module.less';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Pagination, PaginationProps } from 'antd';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useRequest } from '@@/exports';
import { localURL } from '../../../../config/global';
import examApi from '@/api/examApi';
import { ExamRecordsHistory, GetHistoryExamRecordsResponse } from '@/api/examApi/types';
import PaperItem from '@/pages/Admin/MarkExam/PaperItem';
import { MARK_STATUS_MAP } from '@/pages/Student/HistoryExam/PaperItem/const';
import { useGetClasses } from '@/pages/Admin/PaperManage/hooks/useGetClasses';
import { flushSync } from 'react-dom';
import subjectApi from '@/api/subjectApi';
import { getAllSubjectResponse } from '@/api/subjectApi/const';

export default () => {
  const [subjectId, setSubjectId] = useState<number | undefined>();
  const [status, setStatus] = useState<number>();
  const [classId, setClassId] = useState<number>();
  const [studentName, setStudentName] = useState<string>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);
  const [listTotalCount, setListTotalCount] = useState<number>(0);

  const { data: historyExamRecordsData, run: getExamRecords } = useRequest(
    examApi.getMarkExamRecords,
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

  const { data: subjectsData } = useRequest(subjectApi.getAllSubject, {
    manual: false,
  });
  const subjectOptions: any = useMemo(() => {
    const _res = (subjectsData as getAllSubjectResponse)?.map((item) => {
      return {
        label: item.name,
        value: item.id,
        key: item.id,
      };
    });
    return _res || [];
  }, [subjectsData]);

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <span className={styles.label}>班级：</span>
        <ProFormSelect
          className={styles.select}
          name={'subjectId'}
          onChange={(_classId: number) => {
            setClassId(_classId);
          }}
          placeholder="请选择考生班级"
          width={150}
          request={useGetClasses?.()}
          debounceTime={300}
        />
        <span className={styles.label}>状态：</span>
        <ProFormSelect
          className={styles.select}
          name={'status'}
          placeholder={'请选择考试状态'}
          width={150}
          debounceTime={300}
          onChange={(status: number) => {
            setStatus(status);
          }}
          options={Object.entries(MARK_STATUS_MAP).map(([key, value]) => {
            return {
              label: value,
              key: Number(key),
              value: Number(key),
            };
          })}
        />
        <span className={styles.label}>学科：</span>
        <ProFormSelect
          className={styles.select}
          name={'subjectId'}
          onChange={(subjectId: number) => {
            setSubjectId(subjectId);
          }}
          placeholder="请选择学科"
          width={150}
          options={subjectOptions}
        />
        <span className={styles.label}>考生姓名：</span>
        <ProFormText
          fieldProps={{
            style: { marginTop: '25px' },
            onChange: (e: any) => {
              setStudentName(e.target.value);
            },
          }}
          name={'studentName'}
          placeholder="考生姓名"
          width={150}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          className={styles.button}
          onClick={() => {
            getExamRecords({ subjectId, pageNo, pageSize, status, classId, studentName });
          }}
        >
          搜索
        </Button>
        <Button
          type="primary"
          className={styles.button}
          onClick={() => {
            flushSync(() => {
              setSubjectId(undefined);
              setStudentName(undefined);
              setClassId(undefined);
              setStatus(undefined);
              setPageNo(1);
              setPageSize(6);
            });
            getExamRecords({ pageNo, pageSize });
          }}
        >
          重置
        </Button>
      </div>
      <div className={styles.display}>
        {exams.map((item) => {
          console.log();
          return (
            <PaperItem
              onDetailClick={() => {
                window.open(`${localURL}/Paper/MarkExam/${item.paperId}/${item.id}`);
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
