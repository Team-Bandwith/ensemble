import axios from 'axios';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import Jam from '../views/Jam.vue';
import Inbox from '../views/Inbox.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/jam',
    name: 'Jam',
    component: Jam,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: Inbox,
    meta: {
      requiresAuth: true,
    },
  },
];

export const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') === null) {
      alert('Please sign up or log in first.');
      next({
        path: '/',
        params: { nextUrl: to.fullPath },
      });
    } else {
      const token = localStorage.getItem('jwt');
      axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/verify`, { token })
        .then(() => next())
        .catch(() => next({
          path: '/',
          params: { nextUrl: to.fullPath },
        }));
    }
  } else {
    next();
  }
});

export default router;
