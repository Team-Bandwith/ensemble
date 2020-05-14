import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import Moment from 'vue-moment';
import {
  faUserSecret, faHome, faTint, faUsers,
  faPhone, faChild, faUser, faMusic,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import { router } from './router/index';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

library.add(faUserSecret);
library.add(faHome);
library.add(faTint);
library.add(faUsers);
library.add(faPhone);
library.add(faChild);
library.add(faUser);
library.add(faMusic);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// Moment.js
Vue.use(Moment);
Vue.use(VueRouter);
Vue.component('font-awesome-icon', FontAwesomeIcon);

/* eslint-disable import/prefer-default-export */
export const SocketInstance = socketio('http://localhost:8081');
Vue.use(VueSocketIO, SocketInstance);

Vue.config.productionTip = false;
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
