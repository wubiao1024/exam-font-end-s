import { CSSProperties } from 'react';
import { Button } from 'antd';
import styles from './index.module.less';
import { DeleteFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';

type props = {
  title: string;
  totalScore?: number;
  subjectName: string;
  onDetailClick?: () => void;
  onDeleteClick?: () => void;
  onPreviewClick?: () => void;
  style?: CSSProperties;
  className?: string;
  onPublishClick: () => void;
};
export default ({
  title,
  totalScore = 0,
  subjectName,
  className,
  style,
  onDetailClick,
  onDeleteClick,
  onPreviewClick,
  onPublishClick,
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

      <DeleteOutlined className={`${styles.deleteIcon} ai-delete icon`} onClick={onDeleteClick} />

      <span className={styles.title}>{title}</span>
      <div className={styles.info}>
        <div className={styles.subjectName}>
          <span className={styles.label}>试卷学科：</span>
          <span className={styles.content}>{subjectName}</span>
        </div>
        <div className={styles.score}>
          <span className={styles.label}>试卷总分：</span>
          <span className={styles.content}>{`${totalScore}分`}</span>
        </div>
      </div>

      <div className={styles.bottomButtons}>
        <Button
          type={'primary'}
          onClick={onDetailClick}
          className={`${styles.item} ${styles.editButton}`}
          icon={<EditOutlined />}
        >
          编辑试卷
        </Button>
        <Button
          type={'primary'}
          onClick={onPreviewClick}
          className={`${styles.item} ${styles.previewButton}`}
          icon={
            <svg className="icon" style={{ width: 20, height: 16 }} aria-hidden="true">
              <use xlinkHref="#icon-zitiyulan"></use>
            </svg>
          }
        >
          预览
        </Button>
        <Button
          type={'primary'}
          onClick={onPublishClick}
          className={`${styles.item} ${styles.previewButton} ${styles.disabledButton}`}
          icon={
            <svg
              className="icon"
              style={{ width: 20, height: 16, color: 'white' }}
              aria-hidden="true"
            >
              <use xlinkHref="#icon-fabu"></use>
            </svg>
          }
        >
          发布考试
        </Button>
      </div>
    </div>
  );
};
