import { Modal } from 'antd';
import StudentsDisplay from '@/pages/Admin/PaperManage/StudentsDisplay';
import { useRef, useState } from 'react';
import {
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  StepsForm,
} from '@ant-design/pro-components';
import { values } from 'lodash';

type Props = {
  onSubmit: (data: { duration?: number; startTime?: string; studentIds: number[] }) => void;
  onCancel: () => void;
  isOpen: boolean;
};

const initValues = {
  duration: 120,
};
export default ({ onSubmit, onCancel, isOpen }: Props) => {
  const [studentIds, setStudentIds] = useState<number[]>();
  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);
  return (
    <>
      <StepsForm
        formMapRef={formMapRef}
        onFinish={async (values) => {
          onSubmit({ ...values, studentIds: studentIds || [] });
          // 清空已选学生
          setStudentIds(undefined);
          return true;
        }}
        stepsFormRender={(dom: any, submitter) => {
          return (
            <Modal
              destroyOnClose={true}
              afterOpenChange={(_open) => {
                formMapRef?.current?.forEach((formInstanceRef) => {
                  formInstanceRef?.current?.setFieldsValue(initValues);
                });
              }}
              title="发布考试"
              open={isOpen}
              onCancel={() => {
                // 清空已选学生
                setStudentIds(undefined);
                onCancel?.();
              }}
              cancelText="取消"
              width={'90%'}
              footer={submitter}
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm>
          {/* 考试开始时间*/}
          <ProFormDateTimePicker
            name={'startTime'}
            label={'考试开始时间'}
            width={'xl'}
            fieldProps={{
              format: 'YYYY-MM-DD HH:mm:ss',
            }}
            rules={[{ required: true, message: '请选择考试开始时间' }]}
          />
          {/*  考试时长 */}
          <ProFormDigit
            name={'duration'}
            label={'考试时长(分钟)'}
            fieldProps={{
              defaultValue: 120,
            }}
            rules={[{ required: true, message: '请输入考试时长' }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm>
          <StudentsDisplay
            onChange={(studentIds) => {
              setStudentIds(studentIds);
            }}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};
