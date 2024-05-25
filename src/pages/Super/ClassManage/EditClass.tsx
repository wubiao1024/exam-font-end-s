import { ModalForm, ProFormGroup, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { GetAllClassesResponse } from '@/api/classApi/types';
import { useForm } from 'antd/es/form/Form';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

type props = {
  initialValues?: GetAllClassesResponse[number];
  onSubmit: (values: GetAllClassesResponse[number]) => void;
  open: boolean;
  onClose: () => void;
};
export default ({ initialValues, onSubmit, open = false, onClose }: props) => {
  const [form] = useForm<GetAllClassesResponse[number]>();
  return (
    <ModalForm
      width={'500px'}
      form={form}
      title={!!initialValues ? '编辑班级' : '新增班级'}
      trigger={<Button type="primary">新增</Button>}
      onFinish={async (values) => {
        onSubmit?.({ ...initialValues, ...values });
        return true;
      }}
      open={open}
      onOpenChange={(open) => {
        // 打开表单时初始化
        open && initialValues && form.setFieldsValue(initialValues);
        // 关闭表单时清空表单
        if (!open) {
          form.resetFields();
          onClose && onClose();
        }
      }}
    >
      <ProFormText
        width={'lg'}
        name="className"
        label="班级名称"
        rules={[{ required: true, message: '请输入班级名称' }]}
      />
      <ProFormTextArea
        width={'lg'}
        name="description"
        label="班级描述"
        rules={[{ required: false, message: '请输入班级描述' }]}
      />
    </ModalForm>
  );
};
