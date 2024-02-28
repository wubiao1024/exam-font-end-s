export type SiderTheme = 'light' | 'dark';

export const Welcome = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    ></div>
  );
};
