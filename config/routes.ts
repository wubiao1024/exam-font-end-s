export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './SysAdmin' },
    ],
  },
  { path: '/myExam', name: '待考试', icon: 'icon-daibanshixiang', component: './MyExam' },
  { path: '/historyExam', name: '历史考试', icon: 'icon-lishijilu', component: './HistoryExam' },
  {
    path: '/admin/questionManage',
    name: '试题管理',
    icon: 'icon-shiti',
    component: './Admin/QuestionManage',
  },
  {
    path: '/admin/PaperManage',
    name: '试卷管理',
    icon: 'icon-shijuan',
    component: './Admin/QuestionManage',
  },
  {
    path: '/admin/scoreManege',
    name: '成绩管理',
    icon: 'icon-tongji',
    component: './Admin/ScoreManage',
  },
  // 重定向
  { path: '/', redirect: '/myExam' },
  { path: '*', layout: false, component: './404' },
];
