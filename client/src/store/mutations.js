export const LOGIN = state => {
  state.pending = true;
};

export const LOGIN_SUCCESS = state => {
  state.isLoggedIn = true;
  state.pending = false;
  state.userName = JSON.parse(localStorage.getItem('auth')).user;
  state.token = JSON.parse(localStorage.getItem('auth')).token;
};

export const LOGIN_FAILED = state => {
  state.isLoggedIn = false;
  state.pending = false;
};

export const LOGOUT = state => {
  state.isLoggedIn = false;
  state.userName = null;
  state.token = null;
};
