import { useState } from 'react';

type userInfoType = {
  realName?: 'string';
  contactInfo?: 'string';
  nickname?: 'string';
  avatar?: 'string';
  id?: number;
  username?: 'string';
};
export default () => {
  const [userInfo, setUserInfo] = useState<userInfoType>();
  const [token, setToken] = useState<string>('');
  return { userInfo, setUserInfo, token, setToken };
};
