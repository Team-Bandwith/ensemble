import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import Jam from '../views/Jam.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/jam', name: 'Jam', component: Jam },
];

export const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
