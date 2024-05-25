import {
  ProForm,
  ProFormGroup,
  ProFormInstance,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import userApi from '@/api/userApi';
import { useModel } from '@umijs/max';
import { UpdatePasswordRequest, UpdateUserRequest } from '@/api/userApi/types';
import styles from './index.module.less';
import Submitter from '@/pages/User/Center/UpdateUserInfo/Submitter';
import e from 'express';

export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser: userInfo } = initialState || {};

  const formRef = useRef<ProFormInstance>();

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const updateUserInfo = useCallback((data: UpdateUserRequest) => {
    userApi.updateUserInfo(data).then(({ success }) => {
      if (success) {
        message.success('用户信息修改成功');
        setIsEdit(false);
      }
    });
  }, []);

  return (
    <>
      <Card title={'基本信息'} style={{ height: '150px' }}>
        <div className={styles.baseInfo}>
          <div className={styles.item}>
            <span className={styles.label}>登录名：</span>
            {userInfo?.username}
          </div>
          <div className={styles.item}>
            <span className={styles.label}>班级：</span>
            {userInfo?.className}
          </div>
          <div className={styles.item}>
            <span className={styles.label}>用户id：</span>
            {userInfo?.id}
          </div>
        </div>
      </Card>
      <br />

      <Card title={'修改个人信息'}>
        <ProForm
          /*submitter={{
            render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
          }}*/
          formRef={formRef}
          disabled={!isEdit}
          submitter={false}
          onFinish={async (values) => console.log(values)}
        >
          <ProFormGroup style={{ margin: 20 }}>
            <ProFormRadio.Group
              name="gender"
              label="性别"
              options={[
                {
                  label: '男',
                  value: 0,
                },
                {
                  label: '女',
                  value: 1,
                },
              ]}
              initialValue={userInfo?.gender}
            />
          </ProFormGroup>
          <ProFormGroup style={{ margin: 20 }}>
            <ProFormText
              name="email"
              label="邮箱"
              width={'md'}
              initialValue={userInfo?.email}
              rules={[
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '请输入正确的邮箱格式,如：wubiao_1024@163.com',
                },
                { required: !!userInfo?.email, message: '请输入邮箱' },
              ]}
            />
            <ProFormText
              width={'md'}
              name="contactInfo"
              label="联系方式"
              initialValue={userInfo?.contactInfo}
              rules={[{ required: true, message: '请输入联系方式' }]}
            />
          </ProFormGroup>
          <ProFormGroup style={{ margin: 20 }}>
            <ProFormText
              name="realName"
              width={'md'}
              label="真实姓名"
              initialValue={userInfo?.realName}
              rules={[{ required: true, message: '请输入真实姓名' }]}
            />
            <ProFormText
              name="nickname"
              width={'md'}
              label="昵称"
              initialValue={userInfo?.nickname}
              rules={[{ required: true, message: '请输入昵称' }]}
            />
          </ProFormGroup>
        </ProForm>
        <Submitter
          isEdit={isEdit}
          onSubmit={() => {
            formRef?.current
              ?.validateFields()
              .then((values) => {
                updateUserInfo({ ...values, id: userInfo?.id });
              })
              .catch((err) => {
                message.error('请检查表单验证数据');
                console.log(err, 'error');
              });
          }}
          onCancel={() => {
            formRef?.current?.resetFields();
            setIsEdit(false);
          }}
          onEdit={() => {
            setIsEdit(true);
          }}
        />
      </Card>
      <br />
    </>
  );
};
