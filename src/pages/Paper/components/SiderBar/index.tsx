import { Card } from 'antd';
import styles from './index.module.less';

import Li from '@/pages/Paper/components/SiderBar/Li';

export default ({ onItemClick, selectedKeys, title, ...rest }: SiderBarProps) => {
  return (
    <Card>
      <div>{title}</div>
      <ul className={styles.ul}>
        {selectedKeys?.map(({ id, isFinished }, index) => (
          <Li
            {...rest}
            key={id}
            id={id}
            isFinished={isFinished}
            index={index + 1}
            onItemClick={onItemClick}
          />
        ))}
      </ul>
    </Card>
  );
};
