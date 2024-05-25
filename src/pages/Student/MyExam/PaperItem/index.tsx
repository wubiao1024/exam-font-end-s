import { CSSProperties } from 'react';
import { Button } from 'antd';
import styles from './index.module.less';
import { PlayCircleOutlined } from '@ant-design/icons';
import { EMPTY_TEXT } from '../../../../../config/global';

type props = {
  title: string;
  totalScore?: number;
  duration?: number;
  startTime?: string;
  subjectName: string;
  style?: CSSProperties;
  className?: string;
  onStartClick: () => void;
};
export default ({
  title,
  totalScore = 0,
  subjectName,
  className,
  style,
  onStartClick,
  duration,
  startTime,
}: props) => {
  return (
    <div style={style} className={`${className} ${styles.container}`}>
      <svg
        style={{
          position: 'absolute',
          top: '5',
          left: '5',
          width: '40px',
          height: '50px',
        }}
      >
        <use xlinkHref="#icon-shijuan"></use>
      </svg>
      <span className={styles.title}>{title}</span>
      <div className={styles.info}>
        <div>
          <span className={styles.label}>考试科目：</span>
          <span className={styles.content}>{subjectName}</span>
        </div>
        <div>
          <span className={styles.label}>试卷总分：</span>
          <span className={styles.content}>{`${totalScore}分`}</span>
        </div>
        <div>
          <span className={styles.label}>考试时长：</span>
          <span className={styles.content}>{duration ? `${duration}分钟` : EMPTY_TEXT}</span>
        </div>
        <div>
          <span className={styles.label}>开考时间：</span>
          <span className={styles.content}>{`${startTime || EMPTY_TEXT}`}</span>
        </div>
      </div>

      <Button
        type={'primary'}
        onClick={onStartClick}
        className={styles.startBtn}
        icon={<PlayCircleOutlined />}
      >
        开始考试
      </Button>
    </div>
  );
};
