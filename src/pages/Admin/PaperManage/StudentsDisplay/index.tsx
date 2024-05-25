import { ActionType, ProColumnType, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { GetAllClassesResponse } from '@/api/classApi/types';

import { GetUsersResponse } from '@/api/userApi/types';
import userApi from '@/api/userApi';
import { useGetClasses } from '@/pages/Admin/PaperManage/hooks/useGetClasses';

const initData = {
  bordered: true,
  loading: false,
  size: 'small',
  expandable: false,
  headerTitle: '选择用户',
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

type props = {
  onChange: (userIds: number[]) => void;
};

export default ({ onChange }: props) => {
  const [config] = useState<any>(initData);
  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
    total?: number;
  }>({ pageSize: 5, current: 1, total: 0 });

  const tableRef = useRef<ActionType>();

  //@ts-ignore
  const columns: ProColumnType<GetAllClassesResponse[number]> = [
    { title: '序号', valueType: 'index' },
    {
      title: '用户id',
      dataIndex: 'id',
      key: 'id',
      valueType: 'digit',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    /*{
      title: '身份',
      dataIndex: 'roles',
      key: 'roles',
      hideInSearch: true,
      render: (text: any, record: GetAllClassesResponse[number], index: number, action: any) => {
        return record.roles
          .map((role: Role) => ROLE_MAP[role.roleName as keyof typeof ROLE_MAP])
          .join(',');
      },
    },*/
    {
      title: '班级名称',
      dataIndex: 'className',
      key: 'classId',
      order: 1,
      valueType: 'select',
      request: useGetClasses(),
    },
    // 联系方式
    {
      title: '联系方式',
      dataIndex: 'contactInfo',
      key: 'contactInfo',
      hideInSearch: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      hideInSearch: true,
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
              </div>
            );
          },
        }}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys: number[]) => {
            onChange(selectedRowKeys);
          },
        }}
        pagination={{
          ...pagination,
          pageSizeOptions: ['5', '8', '10'],
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
          const { success, data: userListData } = await userApi.getUsersWithRole({
            ...params,
            role: 'STUDENT',
          } as any);
          const { listTotalCount: total, userList } = userListData as GetUsersResponse;
          setPagination((prevPagination) => ({
            ...prevPagination,
            total,
          }));

          return {
            success: success,
            data: userList.map((item) => ({ ...item, key: item.id })),
            // total: res?.data.listTotalCount,
          };
        }}
      ></ProTable>
    </>
  );
};
