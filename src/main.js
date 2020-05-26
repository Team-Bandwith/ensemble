import Vue from 'vue';
import VueRouter from 'vue-router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import Moment from 'vue-moment';
import {
  faUserSecret, faHome, faTint, faUsers,
  faPhone, faChild, faUser, faMusic, faComments,
  faPlay, faPause, faAddressBook, faThumbsUp, faThumbsDown, faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import vSelect from 'vue-select';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import VueProgress from 'vue-progress-path';
import underscore from 'vue-underscore';
import App from './App.vue';
import { router } from './router/index';
import 'vue-progress-path/dist/vue-progress-path.css';
import store from './store';
import 'vue-select/dist/vue-select.css';
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
library.add(faComments);
library.add(faPlay);
library.add(faPause);
library.add(faAddressBook);
library.add(faThumbsUp);
library.add(faThumbsDown);
library.add(faSignOutAlt);

// Install BootstrapVue
Vue.use(underscore);
Vue.use(BootstrapVue);
Vue.use(VueProgress);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// Moment.js
Vue.use(Moment);
Vue.use(VueRouter);
Vue.component('v-select', vSelect);
Vue.component('font-awesome-icon', FontAwesomeIcon);

/* eslint-disable import/prefer-default-export */
export const SocketInstance = socketio(process.env.NODE_ENV === 'development'
  ? ':8081' : window.location.origin);
Vue.use(VueSocketIO, SocketInstance);

Vue.config.productionTip = false;
Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
