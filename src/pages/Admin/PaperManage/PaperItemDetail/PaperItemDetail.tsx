import {
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import QuestionDisplay from '@/pages/Admin/QuestionManage/components/QuestionDisplay';
import { useGetSubjects } from '@/pages/Admin/PaperManage/hooks/useGetSubjects';
import { Paper } from '@/api/paperApi/types';
import { useRequest } from '@@/exports';
import paperApi from '@/api/paperApi';
import styles from './index.module.less';

type PaperItemDetailProps = {
  id?: number;
  isOpen: boolean;
  onSubmit: (values: Paper) => void;
  onCancel: () => void;
};
export default function PaperItemDetail({ id, isOpen, onSubmit, onCancel }: PaperItemDetailProps) {
  const [formData, setFormData] = useState<Paper | undefined>();

  const [current, setCurrent] = useState<number>(0);

  const formMapRef = useRef<MutableRefObject<ProFormInstance<any> | undefined>[]>([]);

  const { StepForm } = StepsForm;

  const { run: getPaperById, data: _paper } = useRequest(paperApi.getPaperById, {
    manual: true,
    onSuccess: (res: any) => {
      // 编辑场景下需要使用formMapRef循环设置formData
      formMapRef?.current?.forEach((formInstanceRef) => {
        formInstanceRef?.current?.setFieldsValue(res as Paper);
      });
      // 设置formData，选择题才能感知到
      setFormData(JSON.parse(JSON.stringify(res)));
    },
  });

  const afterOpenChange = useCallback(
    (b: boolean) => {
      // 编辑场景下获取试卷信息
      if (b && id) {
        getPaperById({ id: id });
      } else {
        // 新增场景下清除formMapRef的循环
        formMapRef?.current?.forEach((formInstanceRef) => {
          formInstanceRef?.current?.setFieldsValue((res: any) => {
            return undefined;
          });
        });

        setFormData(undefined);

        // 更改页面为首页
        setCurrent(0);
      }
    },
    [id],
  );

  const getPreamble = useCallback((score: number, subjectName: string): string => {
    return `为了您能顺利地完成本次考试，请阅读并注意以下事项：
 一、考试环境
1、若在电脑上参加，请使用谷歌（Chrome）或Edge浏览器；若在移动端请确保电量充足；
2、考试前，请检查所有硬件设备、网络是否正常，确保硬件性能和网络稳定；
3、请尽量选择一处相对安静、不易被打扰的环境；

 二、考试纪律
考生应知悉，在整个考试过程上，考生应承诺自觉遵守考试纪律，并知悉以下行为将会被认定违反考试纪律或作弊行为。违纪考生将视为违纪并取消成绩；
1、不允许出现伪造资料、身份信息等，替代他人或委托 他人代为参加考试的行为；
2、考试全程不允许出现翻看书籍、资料或使用手机、计算器、平板电脑等与考试无关的行为；
3、考试全程不允许以任意方式(包括但不限于抄录、截图摄屏、视频记录等行为)记录或传播考试过程及试题；
4、考试全程不允许出现与考试内容相关的讨论、对话等声音；
本次考试试题属于机密内容，不得对外泄露。如发现有通过摄屏、拍照并在互联网传播等渠道泄露试题的行为，将取消考生本次考试成绩并依法追究相关法律责任；

 三、 考试情况
1、 本次考试科目为${subjectName || ''}
2、 考试卷面满分为${score}分，及格分数线：${Math.floor(score * 0.6)}分`;
  }, []);

  return (
    <StepsForm
      current={current}
      onCurrentChange={(current) => {
        setCurrent(current);
      }}
      onFinish={async (values) => {
        // 更新formData
        const newFormData: Paper = JSON.parse(JSON.stringify(formData));
        // 整合表单数据
        newFormData.preamble = values.preamble;
        newFormData.paper.examDuration = values.paper.examDuration;
        // 提交
        onSubmit(newFormData);
        // 清除已经选择的试题
        setFormData(undefined);
        // 返回第一页
        setCurrent(0);
        return true;
      }}
      formMapRef={formMapRef}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            destroyOnClose
            forceRender
            title={!!id ? '编辑试卷' : '新增试卷'}
            open={isOpen}
            footer={submitter}
            afterOpenChange={afterOpenChange}
            onCancel={() => {
              // 返回第一页
              setCurrent(0);
              onCancel?.();
            }}
            width="60%"
            centered
          >
            {dom}
          </Modal>
        );
      }}
    >
      <StepForm
        name="step1"
        title="试卷信息"
        onFinish={async (values) => {
          setFormData((prev) => ({
            ...prev,
            ...values,
            paper: { ...values.paper, id: id || undefined },
          }));
          return true;
        }}
      >
        <ProFormSelect
          name={['paper', 'subjectId']}
          label="所属学科"
          placeholder="请选择所属学科"
          request={useGetSubjects?.()}
          debounceTime={300}
          rules={[{ required: true, message: '请选择所属学科' }]}
          onChange={(value) => {
            // 切换学科类型需要把试题清空
            setFormData((prev) => Object.assign({}, prev, { questionIds: [] }));
          }}
        />
        <ProFormText
          name={['paper', 'title']}
          label="试卷标题"
          placeholder="请输入试卷标题"
          rules={[{ required: true, message: '请填写试卷标题' }]}
        />

        <ProFormText
          name={['paper', 'description']}
          label="试卷描述"
          placeholder="请输入试卷描述"
        />
      </StepForm>
      <StepForm name="step2" title="选择试题" onFinish={async () => true}>
        <QuestionDisplay
          questionIds={formData?.questionIds}
          showSelectQuestions
          subjectId={formData?.paper?.subjectId}
          onQuestionIdsChanged={(questionIds) => {
            const newFormData: Paper = JSON.parse(JSON.stringify(formData));
            newFormData.questionIds = questionIds;
            setFormData(newFormData);
          }}
        />
      </StepForm>
      <StepForm name="step3" title="试卷设置" style={{ height: '600px' }}>
        {/*<div className={styles.examDuration}>
          <ProFormDigit
            width={'sm'}
            label={'考试时长(分钟)'}
            labelAlign={'left'}
            rules={[{ required: true, message: '请输入考试时长(分钟)' }]}
            name={['paper', 'examDuration']}
          />
        </div>*/}
        <ProFormTextArea
          label={
            <div className={styles.preambleTitle}>
              <span>考前须知</span>
              <Button
                type={'primary'}
                className={styles.button}
                onClick={async () => {
                  const { success, data } = await paperApi.getQuestionTotalScore(
                    formData?.questionIds || [],
                  );
                  if (success) {
                    const newFormData: Paper = JSON.parse(JSON.stringify(formData));
                    newFormData.preamble = getPreamble(
                      data as number,
                      newFormData.paper.subjectName,
                    );
                    // 设置表格的数据
                    formMapRef?.current?.forEach((formInstanceRef) => {
                      formInstanceRef?.current?.setFieldsValue(newFormData as Paper);
                    });
                  }
                }}
              >
                一键生成
              </Button>
            </div>
          }
          name="preamble"
          allowClear
          fieldProps={{ style: { height: '450px' } }}
          rules={[{ required: true, message: '请填写考前须知' }]}
        />
      </StepForm>
    </StepsForm>
  );
}
