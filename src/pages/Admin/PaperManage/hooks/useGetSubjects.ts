import { useCallback } from 'react';
import subjectApi from '@/api/subjectApi';
import { getAllSubjectResponse } from '@/api/subjectApi/const';

export const useGetSubjects = () => {
  return useCallback(async () => {
    const { data } = (await subjectApi.getAllSubject()) as any;
    return data.map((item: getAllSubjectResponse[number]) => ({
      label: item.name,
      value: item.id,
      key: item.id,
    }));
  }, []);
};
