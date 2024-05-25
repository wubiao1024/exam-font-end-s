import { Button } from 'antd';

type Props = {
  isEdit: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onEdit: () => void;
};
export default ({ isEdit = false, onEdit, onSubmit, onCancel }: Props) => {
  return (
    <div style={{ margin: 20 }}>
      {isEdit ? (
        <>
          <Button onClick={onCancel} type={'primary'} style={{ marginRight: 20 }}>
            取消
          </Button>
          <Button onClick={onSubmit} type={'primary'}>
            保存
          </Button>
        </>
      ) : (
        <Button onClick={onEdit} type={'primary'}>
          编辑
        </Button>
      )}
    </div>
  );
};
