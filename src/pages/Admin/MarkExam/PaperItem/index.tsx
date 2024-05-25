import { CSSProperties } from 'react';
import { Button } from 'antd';
import styles from './index.module.less';
import { EMPTY_TEXT } from '../../../../../config/global';
import { STATUS_MAP } from '@/pages/Student/HistoryExam/PaperItem/const';
import moment from 'moment';

type props = {
  title?: string;
  totalScore?: number;
  subjectName?: string;
  style?: CSSProperties;
  startTime?: string;
  status?: number;
  score?: number;
  styleClassName?: string;
  className?: string;
  studentName?: string;
  onDetailClick?: () => void;
};
export default ({
  title,
  totalScore = 0,
  subjectName,
  className,
  style,
  onDetailClick,
  startTime,
  styleClassName,
  status,
  score,
  studentName,
}: props) => {
  return (
    <div style={style} className={`${styleClassName} ${styles.container}`}>
      <svg
        style={{
          position: 'absolute',
          top: '3',
          left: '3',
          width: '30px',
          height: '40px',
        }}
      >
        <use xlinkHref="#icon-shijuan"></use>
      </svg>
      <span className={styles.title}>{title || EMPTY_TEXT}</span>
      <div className={styles.info}>
        <div>
          <span className={styles.label}>考生姓名：</span>
          <span className={styles.content}>{studentName || EMPTY_TEXT}</span>
        </div>
        <div>
          <span className={styles.label}>所在班级：</span>
          <span className={styles.content}>{className || EMPTY_TEXT}</span>
        </div>
        <div>
          <span className={styles.label}>考试学科：</span>
          <span className={styles.content}>{subjectName || EMPTY_TEXT}</span>
        </div>
        <div>
          <span className={styles.label}>试卷总分：</span>
          <span className={styles.content}>{`${totalScore || EMPTY_TEXT}分`}</span>
        </div>
        <div>
          <span className={styles.label}>开考时间：</span>
          <span className={styles.content}>
            {moment(startTime).format('YYYY-MM-DD HH:mm:ss') || EMPTY_TEXT}
          </span>
        </div>
        <div>
          <span className={styles.label}>考生得分：</span>
          <span className={styles.content}>{score || EMPTY_TEXT}分</span>
        </div>
        <div>
          <span className={styles.label}>考试状态：</span>
          <span className={styles.content}>
            {STATUS_MAP[status as keyof typeof STATUS_MAP] || EMPTY_TEXT}
          </span>
        </div>
      </div>

      <Button type={'primary'} onClick={onDetailClick} className={styles.startBtn}>
        开始批阅
      </Button>
    </div>
  );
};
