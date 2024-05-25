import {
  ProForm,
  ProFormDependency,
  ProFormGroup,
  ProFormInstance,
  ProFormItem,
  ProFormText,
} from '@ant-design/pro-components';
import { Card, message } from 'antd';
import Submitter from '@/pages/User/Center/UpdateUserInfo/Submitter';
import { useCallback, useRef, useState } from 'react';
import { UpdatePasswordRequest } from '@/api/userApi/types';
import userApi from '@/api/userApi';
import { useModel } from '@@/exports';
import { useNavigate } from '@umijs/max';
export default () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser: userInfo } = initialState || {};
  const formRef = useRef<ProFormInstance>();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const navigate = useNavigate();

  const updatePassword = useCallback((data: UpdatePasswordRequest) => {
    userApi.updatePassword(data).then(({ success }) => {
      if (success) {
        message.success('密码修改成功,请重新登录');
        setIsEdit(false);
        formRef.current?.resetFields();
        // 跳转登录页面
        navigate('/user/login');
      }
    });
  }, []);

  return (
    <Card title={'修改密码'}>
      <ProForm submitter={false} disabled={!isEdit} formRef={formRef}>
        <ProFormGroup style={{ margin: 20 }}>
          <ProFormText
            width={'lg'}
            initialValue={''}
            label={'原始密码'}
            name={'oldPassword'}
            rules={[
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/i,
                message: '密码必须同时包含字母和数字，长度8-16位',
              },
              {
                required: true,
                message: '请输入原始密码',
              },
            ]}
          />
        </ProFormGroup>
        <ProFormGroup style={{ margin: 20 }}>
          <ProFormText
            initialValue={''}
            width={'lg'}
            name={'newPassword'}
            label={'新密码'}
            rules={[
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/i,
                message: '密码必须同时包含字母和数字，长度8-16位',
              },
              {
                required: true,
                message: '请输入新密码',
              },
            ]}
          />
        </ProFormGroup>

        <ProFormGroup style={{ margin: 20 }}>
          <ProFormDependency name={['newPassword']} style={{ margin: 20 }}>
            {({ newPassword }) => {
              return (
                <ProFormText
                  initialValue={''}
                  name={'newPasswordConfirm'}
                  width={'lg'}
                  label={'确认新密码'}
                  rules={[
                    {
                      pattern: /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/i,
                      message: '密码必须同时包含字母和数字，长度8-16位',
                    },
                    {
                      required: true,
                      message: '请确认新密码',
                    },
                    {
                      pattern: new RegExp(newPassword),
                      message: '两次输入的密码不一致',
                    },
                  ]}
                />
              );
            }}
          </ProFormDependency>
        </ProFormGroup>
      </ProForm>
      <Submitter
        isEdit={isEdit}
        onSubmit={() => {
          formRef?.current
            ?.validateFields()
            .then((values) => {
              const newPassword = formRef.current?.getFieldValue('newPassword');
              const newPasswordConfirm = formRef.current?.getFieldValue('newPasswordConfirm');
              if (newPassword !== newPasswordConfirm) {
                message.error('两次输入的密码不一致，请重新输入');
                return;
              }
              updatePassword({ ...values, id: userInfo?.id });
            })
            .catch((err) => {
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
  );
};
