/**
 * @see https://umijs.org/docs/max/access#access
 *
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    isAdmin: currentUser?.currentRole === 'ADMIN',
    isStudent: currentUser?.currentRole === 'STUDENT',
    isTeacher: currentUser?.currentRole === 'TEACHER',
    hasAdmin: currentUser?.roleNames?.findIndex((item) => item.roleName === 'ADMIN') !== -1,
    hasStudent: currentUser?.roleNames?.findIndex((item) => item.roleName === 'STUDENT') !== -1,
    hasTeacher: currentUser?.roleNames?.findIndex((item) => item.roleName === 'TEACHER') !== -1,
  };
}
