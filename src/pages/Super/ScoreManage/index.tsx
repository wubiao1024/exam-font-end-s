import styles from './index.module.less';
import { ProFormSegmented } from '@ant-design/pro-components';
import { Button, ConfigProvider, Segmented } from 'antd';
import { useState } from 'react';
import ExamRecordStatistic from '@/pages/Super/ScoreManage/ExamRecordStatistic';
import PaperStatistic from '@/pages/Super/ScoreManage/PaperStatistic';
import { SearchOutlined } from '@ant-design/icons';
const themeConfig = {
  components: {
    Segmented: {
      itemSelectedColor: '#FFF',
      itemSelectedBg: '#1890ff',
    },
  },
};
const options = [
  {
    label: '成绩总览',
    value: 1,
  },
  {
    label: '试卷成绩分析',
    value: 2,
  },
];

export default () => {
  const [type, setType] = useState<1 | 2>(1);
  return (
    <ConfigProvider theme={themeConfig}>
      {/* <div className={styles.container}>
        <Segmented
          defaultValue={1}
          options={options}
          size={'middle'}
          onChange={(value) => {
            setType(value as 1 | 2);
          }}
        />
      </div>*/}

      <div style={{ marginTop: 20 }}>
        {type === 1 && <ExamRecordStatistic />}
        {type === 2 && <PaperStatistic />}
      </div>
    </ConfigProvider>
  );
};
