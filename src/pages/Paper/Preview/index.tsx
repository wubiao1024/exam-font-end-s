import React, { useEffect, useMemo } from 'react';

import { Layout } from 'antd';
import { useParams, useRequest } from '@@/exports';
import styles from './index.module.less';
import type { CountdownProps } from 'antd';
import paperApi from '@/api/paperApi';
import { GetQuestionInfoByIdsResponse, Paper } from '@/api/paperApi/types';
import TopBar from '@/pages/Paper/components/TopBar';
import { EMPTY_TEXT } from '../../../../config/global';
import SiderBar from '@/pages/Paper/components/SiderBar';
import { IndexMap, questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import ContentItem from '@/pages/Paper/components/ContentItem';
import { QuestionType } from '@/api/questionApi/const';
import PubSub from 'pubsub-js';

const { Header, Content, Footer, Sider } = Layout;

const QuestionRenderIndexArray = ['XZ', 'PD', 'TK', 'JD']; // 渲染顺序

const PreView: React.FC = () => {
  const { paperId, deadline: _deadline } = useParams();
  const deadline = useMemo(() => {
    return Number(_deadline) || new Date().getTime() + 1000 * 60 * 60 * 2;
  }, [_deadline]);

  const { data: paper, run: getPaperById } = useRequest(paperApi.getPaperById, {
    manual: true,
  });

  const { paper: _paper, questionIds } = useMemo(() => {
    if (!!paper) {
      return paper as Paper;
    } else {
      return { paper: null, questionIds: [] };
    }
  }, [paper as Paper]);

  const { data: questionInfo, run: getQuestionInfoByIds } = useRequest(
    paperApi.getQuestionInfoByIds,
    {
      manual: true,
      onSuccess: (questionInfo) => {
        // TODO 处理相应的数据
        console.log(questionInfo);
      },
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

  // 初始化
  useEffect(() => {
    if (questionIds && questionIds.length > 0) {
      getQuestionInfoByIds(questionIds);
    }
  }, [questionIds]);

  useEffect(() => {
    if (paperId) {
      getPaperById({ id: Number(paperId) });
    }
  }, [paperId]);

  const onFinish: CountdownProps['onFinish'] = () => {
    // TODO 考试结束
    console.log('finished!');
  };

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
            title={_paper?.title || EMPTY_TEXT}
          ></TopBar>
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
                  })`}
                  onItemInputChange={({ id, questionType, newAnswer }) => {
                    // 发布按钮颜色改变的通知
                    PubSub.publish('changeAnswerCardColor', {
                      id: id,
                      questionType: questionType,
                      newAnswer: newAnswer,
                    });
                    //TODO 后端保存数据，，，，，
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
    </Layout>
  );
};

export default PreView;
