import { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import styles from '@/pages/Paper/components/SiderBar/index.module.less';
import { ModeType } from '@/pages/Paper/components/ContentItem/type';
export default ({
  id,
  isFinished,
  onItemClick,
  mode,
  index,
}: {
  id: number;
  isFinished: boolean;
  onItemClick: (id: number) => void;
  index: number;
  mode?: ModeType;
}) => {
  const [_isFinished, set_isFinished] = useState<boolean>(false);
  useEffect(() => {
    set_isFinished(isFinished);
  }, []);
  useEffect(() => {
    // 订阅改变按钮颜色的通知
    PubSub.subscribe('changeAnswerCardColor', (msg, { id: _id, questionType, newAnswer }) => {
      //TODO 还有更好的判断方式吗？？？
      if (_id === id) {
        // 说明对接上了
        if (questionType === 'JD' && mode !== 'mark') {
          newAnswer === '<p><br></p>' ? set_isFinished(false) : set_isFinished(true);
        } else {
          newAnswer !== undefined ? set_isFinished(true) : set_isFinished(false);
        }
      }
    });
    return () => {
      PubSub.unsubscribe('changeAnswerColor');
    };
  }, [id]);
  return (
    <li key={id} className={`${styles.li} ${_isFinished ? styles.finished : ''}`}>
      <a
        onClick={() => {
          document.getElementById(id?.toString())?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }}
        className={styles.a}
      >
        {index}
      </a>
    </li>
  );
};
