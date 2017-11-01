import VueRouter from 'vue-router';

import Signup from '../components/Signup';
import Login from '../components/Login';
import Home from '../components/Home';
import LoginError from '../components/LoginError';
import CreatePoll from '../components/CreatePoll';
import UpdatePoll from '../components/UpdatePoll';
import MyPolls from '../components/MyPolls';
import Polls from '../components/Polls';
import Poll from '../components/Poll';
import PageNotFound from '../components/PageNotFound';

/* eslint-disable no-undef */
const routes = [
  {
    path: '/',
    component: Home,
    meta: {title: 'EnterPoll | Welcome'}
  },
  {
    path: '/polls',
    component: Polls,
    meta: {title: 'EnterPoll | Live Polls'}
  },
  {
    path: '/polls/:id',
    component: Poll,
    meta: {title: 'EnterPoll | Vote now!'}
  },
  {
    path: '/signup',
    component: Signup,
    meta: {title: 'EnterPoll | Sign up'}
  },
  {
    path: '/login',
    component: Login,
    meta: {title: 'EnterPoll | Log in'}
  },
  {
    path: '/login-error',
    component: LoginError,
    meta: {title: 'EnterPoll | Error'}
  },
  {
    path: '/create-poll',
    component: CreatePoll,
    meta: {title: 'EnterPoll | Create a new poll'}
  },
  {
    path: '/update-poll/:id',
    component: UpdatePoll,
    meta: {title: 'EnterPoll | Update poll'}
  },
  {
    path: '/my-polls',
    component: MyPolls,
    meta: {title: 'EnterPoll | My polls'}
  },
  {
    path: '/page-not-found',
    component: PageNotFound,
    meta: {title: 'EnterPoll | Page not found'}
  },
  {
    path: '*',
    component: PageNotFound,
    meta: {title: 'EnterPoll'}
  }
];

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export { router };
