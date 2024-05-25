export default [
  // 用户
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },

  // 考生考试
  {
    path: '/Paper/Answer/:examId',
    name: '答题页面',
    component: './Paper/Answer',
    layout: false,
  },

  //考生历史考试详情
  {
    path: '/Paper/ExamDetail/:paperId/:examRecordId',
    name: '答题页面',
    component: './Paper/ExamDetail',
    layout: false,
  },
  //考生答题
  {
    path: '/Paper/Answer/Start/:paperId/:deadline/:examRecordId',
    name: '答题页面',
    component: './Paper/Answer/Start',
    layout: false,
  },

  // 考生待考试
  {
    path: '/student/myExam',
    name: '待考试',
    icon: 'edit',
    component: './Student/MyExam',
  },
  // 考生历史考试
  {
    path: '/student/historyExam',
    name: '历史考试',
    icon: 'safety',
    component: './Student/HistoryExam',
  },

  // 教师试卷预览
  {
    path: '/paper/Preview/:paperId',
    name: '试卷预览',
    component: './Paper/Preview',
    layout: false,
  },
  // 教师题库管理
  {
    path: '/admin/questionManage',
    name: '题库管理',
    icon: 'icon-shiti',
    component: './Admin/QuestionManage',
  },
  // 教师
  {
    path: '/admin/paperManage',
    name: '考试发布',
    icon: 'icon-shijuan',
    component: './Admin/PaperManage',
  },
  // 教师阅卷
  {
    path: '/admin/markExam',
    name: '阅卷',
    icon: 'form',
    component: './Admin/MarkExam',
  },
  // 教师阅卷界面,类似考生答题界面
  {
    path: '/Paper/MarkExam/:paperId/:examRecordId',
    name: '答题页面',
    component: './Paper/MarkExam',
    layout: false,
  },

  // 教务员
  {
    path: '/super/scoreManage',
    name: '成绩统计',
    icon: 'barChart',
    component: './Super/ScoreManage',
  },
  // 教务员
  {
    path: '/super/userManage',
    name: '用户管理',
    icon: 'team',
    component: './Super/UserManage',
  },
  // 教务员
  {
    path: '/super/classManage',
    name: '班级管理',
    icon: 'database',
    component: './Super/ClassManage',
  },
  // TODO
  {
    path: '/user/center',
    name: '个人中心',
    icon: 'user',
    component: './User/Center',
    // access: 'canAdmin',
  },

  // 重定向
  { path: '/', redirect: '/myExam' },
  { path: '*', layout: false, component: './404' },
];
