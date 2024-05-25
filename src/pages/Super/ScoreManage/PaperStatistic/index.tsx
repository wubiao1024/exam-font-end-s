import { ProFormSelect } from '@ant-design/pro-components';
import { Button } from 'antd';
import styles from './index.module.less';

export default () => {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <ProFormSelect label={'请选择试卷'} width={400} />
        <Button type={'primary'}>查询</Button>
      </div>
    </div>
  );
};
