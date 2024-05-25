import UserApi from '@/api/userApi';
import { Footer } from '@/components';
import { ROlE } from '@/pages/User/Login/const';
import { useRequest } from '@@/plugin-request';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Helmet, history } from '@umijs/max';
import { Radio, message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { useModel } from '@@/plugin-model';
import style from './index.module.less';
const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
/*const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};*/
const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { setUserInfo } = useModel('userInfo');

  const { styles } = useStyles();
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setUserInfo(userInfo as any);
      flushSync(() => {
        setInitialState((s: any) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const { data: res, run: handleSubmit } = useRequest(UserApi.login, {
    manual: true,
    async onSuccess(data: any) {
      if (data?.token) {
        message.success('登录成功');
        // 将token 存到全局
        localStorage.setItem('token', data.token);
        // 请求userInfo
        await fetchUserInfo().catch((reason) => message.error(reason));
      }
      // 路由到欢迎页面
      history.replace('/Student/myExam');
    },
  });
  const { Group, Button } = Radio;
  const [role, setRole] = useState('STUDENT');

  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录</title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="在线考试系统"
          subTitle="欢迎使用在线考试系统"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            values['role'] = role;
            await handleSubmit(values as any);
          }}
        >
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined />,
              }}
              placeholder="super"
              initialValue={'super'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              initialValue={'admin123'}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined />,
              }}
              placeholder="admin123"
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <div className={style.roleContent}>
              <span>选择登录身份:</span>
              <Group
                className={style.group}
                name="role"
                buttonStyle={'solid'}
                defaultValue={Object.entries(ROlE)[0][0]}
                onChange={(e) => setRole(e.target.value)}
              >
                {Object.entries(ROlE).map(([key, value]) => (
                  <Button className={style.button} key={key} value={key}>
                    {value}
                  </Button>
                ))}
              </Group>
            </div>

            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Login;
