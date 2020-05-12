import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import Dev from '@/App.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUserSecret, faHome, faTint, faUsers,
  faPhone, faChild,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { router } from './router/index';

library.add(faUserSecret);
library.add(faHome);
library.add(faTint);
library.add(faUsers);
library.add(faPhone);
library.add(faChild);

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(BootstrapVue);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  render: (h) => h(Dev),
  router,
}).$mount('#app');
