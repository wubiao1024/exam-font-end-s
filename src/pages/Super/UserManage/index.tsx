import { ActionType, ProColumnType, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import { GetAllClassesResponse } from '@/api/classApi/types';
import { Button, message, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { GetUsersResponse, Role, UserList } from '@/api/userApi/types';
import userApi from '@/api/userApi';
import { useGetClasses } from '@/pages/Admin/PaperManage/hooks/useGetClasses';
import EditUser from '@/pages/Super/UserManage/EditUser';
import { ROLE_MAP } from '@/pages/Super/UserManage/const';
import { useGetRoles } from '@/pages/Admin/PaperManage/hooks/useGetRoles';

const initData = {
  bordered: true,
  loading: false,
  size: 'small',
  expandable: false,
  headerTitle: '用户管理',
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
  }>({ pageSize: 10, current: 1, total: 0 });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<GetUsersResponse['userList'][number]>();
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
    {
      title: '身份',
      dataIndex: 'roles',
      key: 'roleId',
      order: 2,
      valueType: 'select',
      request: useGetRoles(),
      // hideInSearch: true,
      render: (text: any, record: GetAllClassesResponse[number], index: number, action: any) => {
        return record.roles
          .map((role: Role) => ROLE_MAP[role.roleName as keyof typeof ROLE_MAP])
          .join(',');
      },
    },
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
    {
      title: '操作',
      hideInSearch: true,
      width: '200px',
      render: (text: any, record: UserList, index: number, action: any) => {
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
                  content: '确认删除该班级吗？',
                  onOk: async () => {
                    const { success, message: resMessage } = (await userApi.deleteUser({
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
                <EditUser
                  onSubmit={async (data) => {
                    if (!!data.id) {
                      const { success, message: resMessage } = (await userApi.updateUserRoles(
                        data as any,
                      )) as any;
                      if (success) {
                        message.success(resMessage);
                        tableRef.current?.reload();
                      }
                    } else {
                      // create
                      const { success, message: resMessage } = (await userApi.addUser(data)) as any;
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
          pageSizeOptions: ['10', '15', '20'],
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
          const { success, data: userListData } = await userApi.getAllUsers(params as any);
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
