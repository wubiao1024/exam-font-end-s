import { ProColumnType, ProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { Button } from 'antd';
import { useGetClasses } from '@/pages/Admin/PaperManage/hooks/useGetClasses';
import { ExamRecordsHistory, GetHistoryExamRecordsResponse, Response } from '@/api/examApi/types';
import { useGetSubjects } from '@/pages/Admin/PaperManage/hooks/useGetSubjects';
import examApi from '@/api/examApi';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { EMPTY_TEXT, localURL } from '../../../../../config/global';

const initData = {
  bordered: true,
  loading: false,
  size: 'small',
  expandable: false,
  headerTitle: '成绩统计',
  // tooltip: '高级表格 tooltip',
  // showHeader: true,

  scroll: false,
  hasData: true,
  tableLayout: undefined,
  search: {
    show: true,
    span: 6,
    collapseRender: true,
    labelWidth: '150px',
    // filterType: 'query',
    layout: 'horizontal',
  },
};

export default () => {
  const [config] = useState<any>(initData);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total?: number;
  }>({ pageSize: 10, current: 1, total: 0 });

  //@ts-ignore
  const columns: ProColumnType<any> = [
    { title: '序号', valueType: 'index', width: 60 },
    {
      title: '试卷id',
      dataIndex: 'id',
      key: 'id',
      hideInSearch: true,
      valueType: 'digit',
    },
    {
      title: '试卷名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      hideInSearch: true,
      width: 180,
    },
    {
      title: '姓名',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: '班级',
      dataIndex: 'className',
      key: 'classId',
      order: 1,
      valueType: 'select',
      request: useGetClasses(),
    },
    {
      title: '学科',
      dataIndex: 'subjectName',
      key: 'subjectId',
      order: 1,
      valueType: 'select',
      // hideInTable: true,
      request: useGetSubjects(),
    },

    {
      title: '参考情况',
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      order: 2,
      /*fieldProps: {
        defaultValue: 4,
      },*/
      request: async () => {
        return [
          { label: '参加', value: 4, key: 4 },
          { label: '缺考', value: 0, key: 0 },
        ];
      },
      render: (text: any, record: ExamRecordsHistory, index: number, action: any) => {
        if (record?.status === 4) {
          return (
            <>
              参加
              <CheckOutlined style={{ color: 'green' }} />
            </>
          );
        } else if (record?.status === 0) {
          return (
            <>
              缺考
              <CloseOutlined style={{ color: 'red' }} />
            </>
          );
        }
        return '-';
      },
    },
    {
      title: '得分率',
      dataIndex: 'correctRate',
      key: 'correctRate',
      hideInSearch: true,
      width: 130,
      render: (text: any, record: ExamRecordsHistory, index: number, action: any) => {
        return !!record.correctRate
          ? `${Number(record.correctRate * 100).toFixed(2)}%`
          : EMPTY_TEXT;
      },
    },
    {
      title: '得分情况',
      dataIndex: 'totalScore',
      key: 'totalScore',
      hideInSearch: true,
      width: 80,
      // TODO
      render: (text: any, record: ExamRecordsHistory, index: number, action: any) => {
        let score = record?.score;
        return record?.status === 4 ? (
          <span>
            {score || 0}/{record?.totalScore || 0}
          </span>
        ) : (
          EMPTY_TEXT
        );
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      render: (text: any, record: ExamRecordsHistory, index: number, action: any) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            {/*TODO 详情按钮*/}
            <Button
              disabled={record.status === 0}
              onClick={() => {
                window.open(`${localURL}/Paper/ExamDetail/${record?.paperId}/${record?.id}`);
              }}
              type={'primary'}
            >
              答题情况
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <ProTable
        {...config}
        rowSelection={false}
        pagination={{
          ...pagination,
          pageSizeOptions: ['10', '15', '20', '25'],
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: (current, size) => {
            setPagination((prevPagination) => ({
              ...prevPagination,
              pageSize: size,
              current: current,
            }));
          },
          onChange: (current, size) => {
            setPagination((prevPagination) => ({
              ...prevPagination,
              current: current,
              pageSize: size,
            }));
          },
        }}
        columns={columns}
        request={async (params: any) => {
          console.log(params, 'params');
          const { success, data: examListData } = (await examApi.getStatisticsExamRecords({
            ...params,
            pageNo: params.current,
          })) as Response;
          const { listTotalCount: total, examRecordsHistoryList } =
            examListData as GetHistoryExamRecordsResponse;
          setPagination((prevPagination) => ({
            ...prevPagination,
            total,
          }));
          return {
            success: success,
            data: examRecordsHistoryList.map((item) => ({ ...item, key: item.id })),
            // total: res?.data.listTotalCount,
          };
        }}
      ></ProTable>
    </>
  );
};
