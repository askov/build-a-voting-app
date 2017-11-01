import * as types from './mutation-types';
import axios from 'axios';

export const login = ({ commit }, creds) => {
  commit(types.LOGIN);
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      /* eslint-disable no-undef */
      url: API_URL + 'login',
      data: {
        email: creds.email,
        password: creds.password
      }
    })
      .then(response => {
        localStorage.setItem('auth', JSON.stringify(response.data));
        commit(types.LOGIN_SUCCESS);
        resolve(response);
      })
      .catch(error => {
        commit(types.LOGIN_FAILED);
        console.log(`#### Error occured: ###\n${error}`);
        reject(error);
      });
  });
};

export const logout = ({ commit }) => {
  localStorage.removeItem('auth');
  commit(types.LOGOUT);
};
