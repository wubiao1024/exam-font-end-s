import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="2024 洛克 在线考试系统"
      links={[
        {
          key: 'Rock',
          title: '在线考试系统',
          href: '#',
          blankTarget: false,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'http://www.baidu.com',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
