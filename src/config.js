const BASE_URL = 'http://10.58.52.81:8000';

const API = {
  Login: `${BASE_URL}/Login`,
  UserSignUp: `${BASE_URL}/users/update`,
  UserAuth: `${BASE_URL}/users/auth`,
  UserInfo: `${BASE_URL}/users/info`,
  MainJoin: `${BASE_URL}/family/join`,
  MainCreate: `${BASE_URL}/family/book`,
  MainFlow: `${BASE_URL}/flow`,
  MainBarChart: `${BASE_URL}/flow/view`,
  MainPieChart: `${BASE_URL}/flow/view`,
  SettingFixed: `${BASE_URL}/flow/fixed`,
  SettingFlowType: `${BASE_URL}/flow-type`,
  SettingCategory: `${BASE_URL}/category`,
  SettingAuthCode: `${BASE_URL}/family/auth-code`,
  TableFlow: `${BASE_URL}/flow`,
  Allowance: `${BASE_URL}/allowance`,
  FamilyUser: `${BASE_URL}/family/user`,
  Budget: `${BASE_URL}/budget`,
};

export default API;
