import { useCallback } from 'react';
import roleApi from '@/api/roleApi';
import { GetRoleResponse } from '@/api/roleApi/type';
import { ROLE_MAP } from '@/pages/Super/UserManage/const';

export const useGetRoles = () => {
  return useCallback(async () => {
    const { data } = (await roleApi.getRoles()) as any;
    return data.map((item: GetRoleResponse) => ({
      label: ROLE_MAP[item.roleName as keyof typeof ROLE_MAP],
      value: item.id,
      key: item.id,
    }));
  }, []);
};
