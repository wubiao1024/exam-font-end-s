interface SiderBarProps {
  onItemClick: (id: number) => void;
  title: string;
  mode?: ModeType;
  selectedKeys: { id: number; isFinished: boolean }[];
}

type ModeType = 'history' | 'answer' | 'mark';
