import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
  // const { token } = theme.useToken();
  // const { initialState } = useModel('@@initialState');
  return (
    <PageContainer>
      <Card>{'Hello World!'}</Card>
    </PageContainer>
  );
};

export default Welcome;
