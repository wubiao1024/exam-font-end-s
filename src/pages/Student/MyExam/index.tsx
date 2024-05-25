import PaperItem from '@/pages/Student/MyExam/PaperItem';
import styles from './index.module.less';
import { useEffect, useMemo } from 'react';

import { useRequest } from '@@/exports';
import { localURL } from '../../../../config/global';
import examApi from '@/api/examApi';
import { GetExamRecordsResponse } from '@/api/examApi/types';

export default () => {
  const { data: allExamsData, run: getAllExams } = useRequest(examApi.getExamRecords, {
    manual: false,
    defaultParams: [],
  });

  // 读取exams
  const exams: GetExamRecordsResponse['examRecordsTODOList'] = useMemo(() => {
    return allExamsData?.examRecordsTODOList || [];
  }, [allExamsData]);

  // 初始发起一次请求
  useEffect(() => {
    getAllExams();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.display}>
        {exams?.map((item) => (
          <PaperItem
            onStartClick={() => {
              window.open(`${localURL}/Paper/answer/${item.id}`);
            }}
            className={styles.item}
            {...item}
            key={item?.id}
          />
        ))}
        {!exams?.length && (
          <div className={styles.empty}>
            <p>暂无考试</p>
          </div>
        )}
      </div>
    </div>
  );
};
