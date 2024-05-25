import { QAuto, QOperation } from '@/api/questionApi/const';
import { Card, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
type props = {
  qAuto?: QAuto;
  isEdit?: boolean;
};
export default ({ qAuto, isEdit }: props) => {
  const getJSX = (title: string, description: string) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <span style={{ width: '7%' }}>{title + ': '}</span>
        <TextArea style={{ width: '95%' }} autoSize defaultValue={description} disabled={!isEdit} />
      </div>
    );
  };

  return (
    <Card>
      {qAuto?.description && getJSX('题目描述', qAuto.description)}
      {qAuto?.A && getJSX('A', qAuto.A)}
      {qAuto?.B && getJSX('B', qAuto.B)}
      {qAuto?.C && getJSX('C', qAuto.C)}
      {qAuto?.D && getJSX('D', qAuto.D)}
      {qAuto?.answer && getJSX('答案', qAuto.answer)}
    </Card>
  );
};
