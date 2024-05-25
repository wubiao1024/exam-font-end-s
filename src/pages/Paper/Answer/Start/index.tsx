import React, { useEffect, useMemo, useState } from 'react';

import { Button, Layout, message, Modal, Statistic } from 'antd';
import { useParams } from '@@/exports';
import styles from './index.module.less';
import type { CountdownProps } from 'antd';
import paperApi from '@/api/paperApi';
import { GetQuestionInfoByIdsResponse, Paper } from '@/api/paperApi/types';
import TopBar from '@/pages/Paper/components/TopBar';
import { EMPTY_TEXT, localURL } from '../../../../../config/global';
import SiderBar from '@/pages/Paper/components/SiderBar';
import { IndexMap, questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import ContentItem from '@/pages/Paper/components/ContentItem';
import { QuestionType } from '@/api/questionApi/const';
import PubSub from 'pubsub-js';
import { flushSync } from 'react-dom';
import examApi from '@/api/examApi';
import { useRequest } from '@@/plugin-request';

const { Header, Content, Footer, Sider } = Layout;

const QuestionRenderIndexArray = ['XZ', 'PD', 'TK', 'JD']; // 渲染顺序

const StartAnswer: React.FC = () => {
  const { paperId, deadline: _deadline, examRecordId } = useParams();
  const [disable, setDisable] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(true);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const deadline = useMemo(() => {
    return Number(_deadline) || new Date().getTime() + 1000 * 60 * 60 * 2;
  }, [_deadline]);

  const { data: paper, run: getPaperById } = useRequest(paperApi.getPaperById, {
    manual: true,
  });

  useEffect(() => {
    if (paperId) {
      getPaperById({ id: Number(paperId) });
    }
  }, [paperId]);

  const {
    paper: _paper,
    questionIds,
    preamble,
  } = useMemo(() => {
    if (!!paper) {
      return paper as Paper;
    } else {
      return { paper: null, questionIds: [], preamble: '' };
    }
  }, [paper as Paper]);

  const { data: questionInfo } = useRequest(paperApi.getQuestionInfoByExamRecordId, {
    manual: false,
    defaultParams: [{ examRecordId: Number(examRecordId) }],
  });

  const { data: isHiddenPreamble } = useRequest(examApi.getExamFinished, {
    manual: false,
    defaultParams: [{ examRecordId: Number(examRecordId) }],
    onSuccess: () => {
      setIsSubmit(true);
    },
  });

  useEffect(() => {
    if (isHiddenPreamble && isSubmit) {
      Modal.warning({
        title: '考试已结束',
        content: '考试已结束啦！！！！',
        okText: '确定',
        onOk: () => {
          window.location.replace(`${localURL}/Paper/answer/${examRecordId}`);
        },
      });
    }
  }, [isHiddenPreamble, examRecordId, isSubmit]);

  const { totalScore, totalCount, ...other } = useMemo(() => {
    return (
      (questionInfo as GetQuestionInfoByIdsResponse) || {
        totalCount: EMPTY_TEXT,
        totalScore: EMPTY_TEXT,
      }
    );
  }, [questionInfo]);

  const onFinish: CountdownProps['onFinish'] = async () => {
    // TODO 计时结束，考试结束
    const { success } = await examApi.submitExam({ examRecordId: Number(examRecordId) });
    if (success) {
      setIsSubmit(true);
      window.location.reload();
    }
  };
  const onSubmit = async () => {
    // TODO 提交交卷，考试结束
    Modal.confirm({
      title: '确定提交吗？',
      okText: '确定',
      cancelText: '取消',
      content: '提交后将无法修改答案，请确认是否提交',
      onOk: async () => {
        const { success } = await examApi.submitExam({ examRecordId: Number(examRecordId) });
        if (success) {
          setIsSubmit(true);
          window.location.reload();
        }
      },
    });
  };
  const { data: isReadPreamble } = useRequest(examApi.getIsReadPreamble, {
    manual: false,
    defaultParams: [{ examRecordId: Number(examRecordId) }],
  });

  let questionCount = 0;
  let questionCount1 = 0;
  return (
    <Layout hasSider className={styles.container}>
      <Sider theme={'light'} className={styles.sider} width={'300px'}>
        <h2 className={styles.top}>答题卡(总分：{totalScore})</h2>
        {QuestionRenderIndexArray.map((key) => {
          if (other.hasOwnProperty(key)) {
            const value = other[key as QuestionType];
            return (
              <SiderBar
                key={key}
                title={`${IndexMap[++questionCount]}、${questionTypeMap[key]}(${
                  value?.totalScore
                })`}
                onItemClick={(id) => {
                  //TODO 定位到对应位置
                  console.log(id);
                }}
                selectedKeys={value?.contentList?.map((item) => ({
                  id: item.questionId || 0,
                  isFinished: !!item.answer,
                }))}
              />
            );
          } else {
            return <></>;
          }
        })}
      </Sider>
      <Layout className={styles.right}>
        <Header className={styles.header}>
          <TopBar
            deadline={deadline}
            onFinish={onFinish}
            onSubmit={onSubmit}
            title={_paper?.title || EMPTY_TEXT}
          />
        </Header>
        <Content className={styles.content}>
          {QuestionRenderIndexArray.map((key) => {
            if (other.hasOwnProperty(key)) {
              const value = other[key as QuestionType];
              return (
                <ContentItem
                  mode={'answer'}
                  key={key}
                  title={`${IndexMap[++questionCount1]}、${questionTypeMap[key]}(${
                    value?.totalScore
                  }分)`}
                  onItemInputChange={({ id, questionType, newAnswer }) => {
                    // 发布按钮颜色改变的通知
                    PubSub.publish('changeAnswerCardColor', {
                      id: id,
                      questionType: questionType,
                      newAnswer: newAnswer,
                    });
                    examApi.savaAnswer({
                      examRecordId: Number(examRecordId),
                      answer: newAnswer,
                      questionId: Number(id),
                    });
                  }}
                  questionList={value?.contentList}
                />
              );
            } else {
              return <></>;
            }
          })}
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          洛克在线考试系统 ©{new Date().getFullYear()} 洛克
        </Footer>
      </Layout>

      {!isHiddenPreamble && !isReadPreamble && (
        <Modal
          width={'80%'}
          closable={false}
          centered={true}
          cancelButtonProps={{}}
          title={'考试须知'}
          open={open}
          footer={
            <div>
              <Button
                type={'primary'}
                onClick={() => {
                  setOpen(false);
                  examApi.readPreamble({ examRecordId: Number(examRecordId) });
                }}
                disabled={disable}
              >
                我知道了
                {disable && (
                  <Statistic.Countdown
                    style={{ display: 'inline-block' }}
                    value={new Date().getTime() + 1000 * 5}
                    format="ss"
                    valueStyle={{ color: 'inherit', fontSize: '1rem' }}
                    onFinish={() => {
                      flushSync(() => {
                        setDisable(false);
                      });
                    }}
                  />
                )}
              </Button>
            </div>
          }
        >
          <div style={{ height: 'fit-content', whiteSpace: 'pre-wrap' }}>{preamble}</div>
          <br />
        </Modal>
      )}
    </Layout>
  );
};

export default StartAnswer;
