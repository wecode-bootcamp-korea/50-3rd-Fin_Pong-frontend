import React from 'react';
// import KakaoLogin from 'react-kakao-login';
import KakaoLogin from './KakaoLogin/KakaoLogin';

import './Login.scss';

const Login = () => {
  return (
    <div>
      <KakaoLogin />
    </div>
  );
};
export default Login;