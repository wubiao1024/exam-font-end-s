import { useCallback } from 'react';
import classApi from '@/api/classApi';
import { GetAllClassesResponse } from '@/api/classApi/types';

export const useGetClasses = () => {
  return useCallback(async () => {
    const { data } = (await classApi.getAllClasses()) as any;
    return data.map((item: GetAllClassesResponse[number]) => ({
      label: item.className,
      value: item.id,
      key: item.id,
      description: item.description,
    }));
  }, []);
};
