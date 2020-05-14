<script>
import axios from 'axios';
import Vue from 'vue';
import BootstrapSidebar from './components/vue-bootstrap-sidebar.vue';

export default Vue.extend({
  name: 'App',
  components: {
    BootstrapSidebar,
  },
  data() {
    return {
      initialShow: true,
      header: '<h3>Ensemble</h3>',
      links: [
        { name: 'Home', href: { name: 'Home' }, faIcon: ['fas', 'home'] },
        { name: 'Profile', href: { name: 'Profile' }, faIcon: 'user' },
        { name: 'Jam', href: { name: 'Jam' }, faIcon: 'music' },
        { name: 'Inbox', href: { name: 'Inbox' }, faIcon: 'comments' },
      ],
      loggedIn: false,
    };
  },
  mounted() {
    const token = localStorage.getItem('jwt');
    axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/verify`, { token })
      .then(() => {
        this.loggedIn = true;
      });
  },
  methods: {
    onSidebarChanged() {
    },
    logIn() {
      this.loggedIn = true;
    },
    logOut() {
      this.loggedIn = false;
    },
  },
  sockets: {
    connect() {
      console.log('connect');
    },
  },
});
</script>

<template>
  <div id="App">
    <BootstrapSidebar
      v-on:log-in="logIn"
      v-on:log-out="logOut"
      :initial-show="initialShow"
      :links="links"
      :header="header"
      :fa="true"
      :loggedIn=loggedIn
      @sidebarChanged="onSidebarChanged"
    >
      <template v-slot:navbar>
        <b-navbar
          id="mainNavbar"
          toggleable="lg"
          type="light"
          variant="light"
          fixed="top"
        >
          <b-navbar-nav>
            <b-nav-item>
              Ensemble
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar>
      </template>

      <template v-slot:content>
        <b-container style="margin-top: 56px">
          <router-view :loggedIn="loggedIn" />
        </b-container>
      </template>
    </BootstrapSidebar>
  </div>
</template>

<style lang="scss">
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
@import './scss/default-theme';
</style>
