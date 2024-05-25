import styles from './index.module.less';
import { ConfigProvider, Segmented } from 'antd';
import { useState } from 'react';
import UpdateUserInfo from '@/pages/User/Center/UpdateUserInfo';
import { PageContainer } from '@ant-design/pro-components';
import UpdatePassword from '@/pages/User/Center/UpdatePassword';

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
    label: '个人信息',
    value: 1,
  },
  {
    label: '修改密码',
    value: 2,
  },
];

export default () => {
  const [key, setKey] = useState<string>('1');
  return (
    <PageContainer
      tabList={[
        {
          tab: '个人信息',
          key: '1',
        },
        {
          tab: '修改密码',
          key: '2',
        },
      ]}
      onTabChange={(key: string) => {
        setKey(key);
      }}
      footer={undefined}
      waterMarkProps={{
        content: '',
      }}
    >
      {key === '1' && <UpdateUserInfo />}
      {key === '2' && <UpdatePassword />}
    </PageContainer>
  );
};
