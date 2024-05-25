import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type Props = {
  answer: string;
  correctAnswer: string;
};

export default ({ answer, correctAnswer }: Props) => {
  return (
    <p style={{ marginLeft: 20 }}>
      {answer === correctAnswer ? (
        <CheckOutlined style={{ color: '#52c41a', fontWeight: 'bold' }} />
      ) : (
        <CloseOutlined style={{ color: '#f5222d', fontWeight: 'bold' }} />
      )}{' '}
      &nbsp; 正确答案：<span style={{ color: 'red' }}>{correctAnswer}</span>{' '}
    </p>
  );
};
