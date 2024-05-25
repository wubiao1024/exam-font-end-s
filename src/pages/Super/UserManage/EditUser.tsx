import { ModalForm, ProFormCheckbox, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { useForm } from 'antd/es/form/Form';
import { Button } from 'antd';
import { AddUserRequest, UpdateUserRolesRequest } from '@/api/userApi/types';
import { useGetClasses } from '@/pages/Admin/PaperManage/hooks/useGetClasses';
import { useCallback } from 'react';
import roleApi from '@/api/roleApi';
import { ROLE_MAP } from '@/pages/Super/UserManage/const';
import { useGetRoles } from '@/pages/Admin/PaperManage/hooks/useGetRoles';

type props = {
  initialValues?: Partial<AddUserRequest & { id?: number }>;
  onSubmit: (values: Partial<AddUserRequest & { id?: number }>) => void;
  open: boolean;
  onClose: () => void;
};
export default ({ initialValues, onSubmit, open = false, onClose }: props) => {
  const [form] = useForm<AddUserRequest>();
  return (
    <ModalForm
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      width={'800px'}
      form={form}
      title={!!initialValues ? '编辑用户' : '新增用户'}
      trigger={<Button type="primary">新增</Button>}
      onFinish={async (values) => {
        onSubmit?.(Object.assign({ id: initialValues?.id }, values));
        return true;
      }}
      open={open}
      onOpenChange={(open) => {
        // 打开表单时初始化
        const _initialValues = {
          id: initialValues?.id,
          classId: initialValues?.classId,
          roleIds: initialValues?.roles.map((item: any) => item.id),
        };
        open && initialValues && form.setFieldsValue(_initialValues);
        // 关闭表单时清空表单
        if (!open) {
          form.resetFields();
          onClose && onClose();
        }
      }}
    >
      <ProFormSelect
        request={useGetClasses()}
        name="classId"
        label="班级名称"
        rules={[{ required: true, message: '请选择班级' }]}
      />
      <ProFormCheckbox.Group
        name="roleIds"
        label="用户具有的身份"
        request={useGetRoles()}
        rules={[{ required: true, message: '请选择身份' }]}
      />
      {!initialValues && (
        <ProFormText
          name="realName"
          label={'姓名'}
          rules={[{ required: true, message: '请输入姓名' }]}
        />
      )}
      {!initialValues && (
        <ProFormText
          name="username"
          label="登录名"
          rules={[{ required: true, message: '请输入登录名' }]}
        />
      )}
    </ModalForm>
  );
};
