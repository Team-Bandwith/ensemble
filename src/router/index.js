import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
// import Profile from '../views/Profile';
// import Jam from '../views/Jam';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  // { path: '/profile', name: Profile, component: Profile'},
];

export const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
