export default {
  count: 0,
  userName: localStorage.getItem('auth')
      ? JSON.parse(localStorage.getItem('auth')).user
      : null,
  token: localStorage.getItem('auth')
    ? JSON.parse(localStorage.getItem('auth')).token
    : null,
  isLoggedIn: !!localStorage.getItem('auth'),
  pending: false
};
