import { Button, ButtonProps, Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DropDownProps } from 'antd/es/dropdown';
type Props = {
  DropDownProps: DropDownProps;
  ButtonProps?: ButtonProps;
  selectTitle: string;
};
export default ({ DropDownProps, ButtonProps, selectTitle }: Props) => {
  return (
    <Dropdown {...DropDownProps}>
      <Button {...ButtonProps}>
        <Space>
          <>{selectTitle || '请选择'}</>
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};
