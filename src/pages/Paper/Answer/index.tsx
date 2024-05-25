import styles from './index.module.less';
import { useParams, useRequest } from '@@/exports';
import examApi from '@/api/examApi';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ExamRecordsTODOList } from '@/api/examApi/types';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import moment from 'moment';
import { Button, Modal, Statistic } from 'antd';
import { localURL } from '../../../../config/global';
//时间处理

export default () => {
  const { examId } = useParams();
  const { data: _exam, run } = useRequest(examApi.getExamRecordTODOById, {
    manual: true,
  });

  const exam = useMemo(() => {
    return (_exam as ExamRecordsTODOList) || {};
  }, [_exam]);

  const startTime = useMemo(() => {
    return Date.parse((exam as ExamRecordsTODOList)?.startTime);
  }, [exam]);

  const deadline = useMemo(() => {
    // 计算考试结束时间stamp
    const temp = moment(startTime).add((exam as ExamRecordsTODOList)?.duration, 'minutes');
    return temp.valueOf();
  }, [exam as ExamRecordsTODOList]);

  const [loading, setLoading] = useState<boolean>(false);

  const onStartExam = useCallback(async () => {
    setLoading(true);
    // 生成试卷答题记录
    await examApi.generatorRecords({
      id: Number(examId),
    });
    setLoading(false);
    // 跳转到答题页面
    window.location.replace(
      `${localURL}/paper/Answer/Start/${exam?.paperId}/${deadline}/${exam?.id}`,
    );
  }, [exam?.paperId, deadline, loading]);

  const youHavePassed = useMemo(() => {
    //根据开始时间计算已经过了多久
    const now = Date.now();
    const diff = now - startTime;
    return Number(moment.duration(diff, 'milliseconds').asMinutes().toFixed(0));
  }, [startTime]);

  const [isFinished, setIsFinished] = useState<boolean>(true);

  useRequest(examApi.getExamFinished, {
    manual: false,
    defaultParams: [{ examRecordId: Number(examId) }],
    onSuccess: (res) => {
      setIsFinished(res);
    },
  });

  useEffect(() => {
    //根据开始时间计算已经过了多久
    const now = Date.now();
    const diff = now - startTime;
    const duration = moment.duration(diff, 'milliseconds').asMinutes().toFixed(0);
    examApi.getExamFinished({ examRecordId: Number(examId) }).then((res) => {
      if (startTime && startTime <= Date.now()) {
        if (Number(duration) < exam?.duration && !res.data)
          Modal.info({
            title: '考试开始提醒',
            content: '考试已经开始' + duration + '分钟,尽快开始答题',
            okText: '知道了',
          });
        else {
          Modal.warn({
            title: '考试结束',
            content: '考试已经结束啦！',
          });
        }
      }
    });
  }, [startTime, exam]);

  useEffect(() => {
    run({ id: Number(examId) });
  }, [run, examId]);

  return (
    <div className={styles.container}>
      <ProCard className={styles.content}>
        <h1>{(exam as ExamRecordsTODOList)?.title}</h1>
        <ProDescriptions size="small" bordered={true} column={1}>
          <ProDescriptions.Item label={<h2>考试学科</h2>}>
            <h2>{(exam as ExamRecordsTODOList)?.subjectName}</h2>
          </ProDescriptions.Item>

          <ProDescriptions.Item label={<h2>考试时长</h2>}>
            <h2>{(exam as ExamRecordsTODOList)?.duration}分钟</h2>
          </ProDescriptions.Item>
          <ProDescriptions.Item label={<h2>开考时间</h2>}>
            <h2>{moment(startTime).format('YYYY-MM-DD HH:mm:ss')}</h2>
          </ProDescriptions.Item>
          <ProDescriptions.Item label={<h2>试卷总分</h2>}>
            <h2>{(exam as ExamRecordsTODOList)?.totalScore}</h2>
          </ProDescriptions.Item>
          <ProDescriptions.Item label={<h2>开考倒计时</h2>}>
            <h2>
              <Statistic.Countdown value={startTime} />
            </h2>
          </ProDescriptions.Item>
        </ProDescriptions>
        <br />
        {/*考试没有开始、考试时间已经过去、或者已经交卷 都需要禁用按钮*/}
        <Button
          loading={loading}
          type="primary"
          disabled={startTime > Date.now() || youHavePassed >= exam?.duration || isFinished}
          onClick={() => {
            onStartExam?.();
          }}
        >
          {youHavePassed >= exam?.duration || isFinished ? `考试已结束` : `开始考试`}
        </Button>
      </ProCard>
    </div>
  );
};
