import { ActionType, ProColumnType, ProTable, ProTableProps } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { GetAllClassesResponse, GetAllClassesResponseWithPage } from '@/api/classApi/types';
import classApi from '@/api/classApi';
import { Button, message, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import EditClass from '@/pages/Super/ClassManage/EditClass';

const initData = {
  bordered: true,
  loading: false,
  size: 'small',
  expandable: false,
  headerTitle: '班级管理',
  // tooltip: '高级表格 tooltip',
  // showHeader: true,

  scroll: false,
  hasData: true,
  tableLayout: undefined,
  search: {
    show: true,
    span: 8,
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
  }>({ pageSize: 5, current: 1, total: 0 });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<GetAllClassesResponse[number]>();
  const tableRef = useRef<ActionType>();

  //@ts-ignore
  const columns: ProColumnType<GetAllClassesResponse[number]> = [
    { title: '序号', valueType: 'index', width: '10%' },
    {
      title: '班级id',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
      valueType: 'digit',
    },
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'className',
      width: '25%',
    },
    {
      title: '班级描述',
      dataIndex: 'description',
      key: 'description',
      hideInSearch: true,
      ellipsis: true,
      tooltip: true,
      width: '35%%',
    },
    {
      title: '操作',
      hideInSearch: true,
      width: '200px',
      render: (text: any, record: GetAllClassesResponse[number], index: number, action: any) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
            }}
          >
            <Button
              onClick={() => {
                setShowModal(true);
                setCurrentRow(record);
              }}
              icon={<EditOutlined />}
              type={'primary'}
              style={{
                margin: 0,
                padding: 8,
              }}
            >
              编辑
            </Button>
            <Button
              onClick={() => {
                Modal.confirm({
                  title: '确认删除',
                  content: '删除班级可能导致用户数据异常，请谨慎操作,确认？',
                  onOk: async () => {
                    const { success, message: resMessage } = (await classApi.deleteClass({
                      id: record.id,
                    })) as any;
                    if (success) {
                      action.reload();
                      message.success(resMessage);
                    }
                  },
                  onCancel() {
                    message.info('取消删除');
                  },
                });
              }}
              icon={<DeleteOutlined />}
              type={'primary'}
              danger
              style={{
                margin: 0,
                padding: 5,
              }}
            >
              删除
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
        actionRef={tableRef}
        search={{
          ...config.search,
          optionRender: (searchConfig, formProps, doms) => {
            return (
              <div>
                {doms.map((value) => (
                  <> {value}&nbsp; </>
                ))}
                <EditClass
                  onSubmit={async (data) => {
                    if (!!data.id) {
                      const { success, message: resMessage } = (await classApi.updateClass(
                        data,
                      )) as any;
                      if (success) {
                        message.success(resMessage);
                        tableRef.current?.reload();
                      }
                    } else {
                      // create
                      const { success, message: resMessage } = (await classApi.addClass(
                        data,
                      )) as any;
                      if (success) {
                        message.success(resMessage);
                        tableRef.current?.reload();
                      }
                    }
                  }}
                  onClose={() => {
                    setShowModal(false);
                    setCurrentRow(undefined);
                  }}
                  initialValues={currentRow}
                  open={showModal}
                />
              </div>
            );
          },
        }}
        rowSelection={false}
        pagination={{
          ...pagination,
          pageSizeOptions: ['5', '10', '15'],
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
        request={async (params) => {
          //@ts-ignore
          const { success, data: classListData } = await classApi.getAllClassesWithPage(
            params as any,
          );
          const { listTotalCount: total, classList } =
            classListData as GetAllClassesResponseWithPage;
          setPagination((prevPagination) => ({
            ...prevPagination,
            total,
          }));
          return {
            success: success,
            data: classList,
            // total: res?.data.listTotalCount,
          };
        }}
      ></ProTable>
    </>
  );
};
