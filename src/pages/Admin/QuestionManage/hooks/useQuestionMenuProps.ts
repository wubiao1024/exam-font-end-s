import { useMemo } from 'react';
import { questionTypeMap } from '@/pages/Admin/QuestionManage/const';
import { MenuInfo } from 'rc-menu/lib/interface';

export const useQuestionMenuProps = (onMenuClick: (e: MenuInfo) => void) => {
  return {
    items: Object.entries(questionTypeMap).map(([key, value]) => {
      return {
        label: value,
        key,
      };
    }),
    onClick: onMenuClick,
  };
};
