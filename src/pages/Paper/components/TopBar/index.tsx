import { Button, Statistic } from 'antd';
import { FullscreenUtils } from '@/utils/FullscreenUtils';
import styles from './index.module.less';
import React, { useState } from 'react';
import { ModeType } from '@/pages/Paper/components/ContentItem/type';

type TopBarProps = {
  deadline?: number;
  onFinish?: () => void;
  onSubmit?: () => void;
  title: string;
  mode?: ModeType;
};
export default ({ deadline, onFinish, title, onSubmit, mode }: TopBarProps) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  return (
    <>
      {deadline && (
        <Button
          type={'primary'}
          onClick={() => {
            FullscreenUtils.toggleFullscreen().then(() => {
              setIsFullScreen(FullscreenUtils.isFullscreen());
            });
          }}
          className={styles.fullScreenBtn}
        >
          {isFullScreen ? '退出全屏' : '全屏'}
        </Button>
      )}

      <div className={styles.title}>{title}</div>
      <div className={styles.rightTimer}>
        {deadline && (
          <div className={styles.timer}>
            <span>剩余时间：</span>
            <Statistic.Countdown
              valueStyle={{ fontSize: 15 }}
              style={{ height: '30px', display: 'inline-block' }}
              value={deadline}
              onFinish={onFinish}
            />
          </div>
        )}

        {deadline && (
          <Button type={'primary'} onClick={onSubmit}>
            交卷
          </Button>
        )}

        {mode === 'mark' && (
          <Button type={'primary'} onClick={onSubmit}>
            提交
          </Button>
        )}
      </div>
    </>
  );
};
