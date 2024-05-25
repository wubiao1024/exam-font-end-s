import { Button, ButtonProps, Dropdown, DropdownProps, MenuProps, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useRequest } from '@@/exports';
import subjectApi from '@/api/subjectApi';
import { getAllSubjectResponse } from '@/api/subjectApi/const';
import styles from '@/pages/Admin/QuestionManage/components/TopBar/index.module.less';
import { DownOutlined } from '@ant-design/icons';
type Props = {
  onItemClick: (subjectId: number, subjectTitle: string) => void;
  ButtonProps?: ButtonProps;
  DropdownProps?: DropdownProps;
  subjectName?: string;
};
export default ({ onItemClick, ButtonProps, DropdownProps, subjectName }: Props) => {
  const [subjectItems, setSubjectItems] = useState<any>([]);

  const { run: getAllSubject, loading: loading1 } = useRequest(subjectApi.getAllSubject, {
    manual: true,
    onSuccess(data: any) {
      const items = data.reduce((acc: any, item: getAllSubjectResponse[number]) => {
        return [...acc, { label: item.name, key: item.id }];
      }, [] as MenuProps['items']);
      setSubjectItems(items);
    },
  });
  const handleSubjectMenuClick: MenuProps['onClick'] = (e) => {
    const optionItem = subjectItems?.find((item: any) => item?.key?.toString() === e.key);
    onItemClick?.(Number(e.key), optionItem['label']);
  };

  const subjectMenuProps = useMemo(() => {
    return {
      items: subjectItems,
      onClick: handleSubjectMenuClick,
    };
  }, [subjectItems]);

  const handleSelectButtonClick = () => {
    getAllSubject();
  };

  const buttonClassName = useMemo(() => {
    return ButtonProps?.className ? ButtonProps.className : styles.select;
  }, [ButtonProps, styles]);

  return (

    <Dropdown menu={subjectMenuProps} arrow={true} {...DropdownProps}>
      <Button onMouseEnter={handleSelectButtonClick} className={buttonClassName} {...ButtonProps}>
        <Space>
          {subjectName || '请选择学科类型'}
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};
