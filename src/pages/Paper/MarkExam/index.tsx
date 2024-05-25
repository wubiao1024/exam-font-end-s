import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { Layout, message } from 'antd';
import { useParams, useRequest } from '@@/exports';
import styles from './index.module.less';
import paperApi from '@/api/paperApi';
import { GetQuestionInfoByIdsResponse, Paper } from '@/api/paperApi/types';
import TopBar from '@/pages/Paper/components/TopBar';
import { EMPTY_TEXT } from '../../../../config/global';
import SiderBar from '@/pages/Paper/components/SiderBar';
import { IndexMap, questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import ContentItem from '@/pages/Paper/components/ContentItem';
import { QuestionType } from '@/api/questionApi/const';
import PubSub from 'pubsub-js';
import { ProForm, ProFormInstance } from '@ant-design/pro-components';
import examApi from '@/api/examApi';
import swagger from '@/services/swagger';

const { Header, Content, Footer, Sider } = Layout;

const QuestionRenderIndexArray = ['TK', 'JD']; // 渲染顺序

const MarkExam: React.FC = () => {
  const formRef = useRef<ProFormInstance>();

  const { paperId, examRecordId } = useParams();

  const { data: paper } = useRequest(paperApi.getPaperById, {
    manual: false,
    defaultParams: [{ id: Number(paperId) }],
  });

  const { paper: _paper } = useMemo(() => {
    if (!!paper) {
      return paper as Paper;
    } else {
      return { paper: null, questionIds: [] };
    }
  }, [paper as Paper]);

  const { data: questionInfo } = useRequest(
    paperApi.getQuestionInfoByExamRecordIdWithCorrectAnswer,
    {
      manual: false,
      defaultParams: [{ examRecordId: Number(examRecordId) }],
    },
  );

  const { totalScore, totalCount, ...other } = useMemo(() => {
    return (
      (questionInfo as GetQuestionInfoByIdsResponse) || {
        totalCount: EMPTY_TEXT,
        totalScore: EMPTY_TEXT,
      }
    );
  }, [questionInfo]);

  useEffect(() => {
    // TODO 保存数据
    if (other) {
      const data: any = {};
      const arr = [other.TK, other.JD];
      arr.forEach((item) => {
        item?.contentList?.forEach((_item) => {
          const scoreValue = _item.score;
          const scoreKey = `${_item.questionId}-score`;
          const commentValue = _item.comment;
          const commentKey = `${_item.questionId}-comment`;
          data[scoreKey] = scoreValue;
          data[commentKey] = commentValue;
        });
      });
      console.log(data);
      formRef.current?.setFieldsValue(data);
    }
  }, [other]);

  const handleSubmit = useCallback(() => {
    formRef.current
      ?.validateFields()
      .then((res) => {
        // 告诉后端修改状态
        examApi
          .markFinished({
            examRecordId: Number(examRecordId),
          })
          .then(({ success, message: msg }) => {
            if (success) {
              message.success(msg);
            }
          });
      })
      .catch((err) => {
        const { errorFields } = err;
        const id = errorFields[0]?.name[0]?.trim()?.split('-')[0];
        // 定位到错误位置
        const dom = document?.getElementById(`${id}-score`);
        if (dom) {
          dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
  }, [formRef]);

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
                mode={'mark'}
                key={key}
                title={`${IndexMap[++questionCount]}、${questionTypeMap[key]}(${
                  value?.totalScore
                })`}
                onItemClick={(id) => {
                  //TODO 定位到对应位置 ,已经在SiderBar中处理
                }}
                selectedKeys={value?.contentList?.map((item) => ({
                  id: item.questionId || 0,
                  isFinished: item.score !== undefined,
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
          <TopBar title={_paper?.title || EMPTY_TEXT} mode={'mark'} onSubmit={handleSubmit} />
        </Header>
        <Content className={styles.content}>
          <ProForm formRef={formRef} submitter={false}>
            {QuestionRenderIndexArray.map((key) => {
              if (other.hasOwnProperty(key)) {
                const value = other[key as QuestionType];
                return (
                  <ContentItem
                    mode={'mark'}
                    key={key}
                    title={`${IndexMap[++questionCount1]}、${questionTypeMap[key]}(${
                      value?.totalScore
                    })`}
                    onItemInputChange={async ({ id, questionType, comment, score, newAnswer }) => {
                      // 发布按钮颜色改变的通知 不可动
                      PubSub.publish('changeAnswerCardColor', {
                        id: id,
                        questionType: questionType,
                        newAnswer: score,
                      });
                      //TODO 后端保存批阅结果
                      const { success } = await examApi.markQuestion({
                        questionId: id,
                        comment,
                        score,
                        examRecordId: Number(examRecordId),
                      });
                    }}
                    questionList={value?.contentList}
                  />
                );
              } else {
                return <></>;
              }
            })}
          </ProForm>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          洛克在线考试系统 ©{new Date().getFullYear()} 洛克
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MarkExam;
