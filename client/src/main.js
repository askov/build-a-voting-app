// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';

import store from './store';
import App from './components/App';
import { router } from './router';
import ValidateConfig from './plugins/vee-validate';

Vue.use(VueRouter);
Vue.use(VeeValidate, ValidateConfig);

Vue.config.productionTip = false;

/* eslint-disable no-unused-vars */
const app = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
