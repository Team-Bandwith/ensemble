<script>
/* eslint-disable camelcase */
import axios from 'axios';
import { request } from 'graphql-request';
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
        { name: 'Profile', href: '', faIcon: 'user' },
        { name: 'Jam', href: { name: 'Jam' }, faIcon: 'music' },
        { name: 'Inbox', href: { name: 'Inbox' }, faIcon: 'comments' },
      ],
      loggedIn: false,
      user: null,
      liked: [],
      online: [],
      friends: {},
      notifications: 0,
    };
  },
  mounted() {
    this.logIn();
  },
  methods: {
    onSidebarChanged() {
    },
    logIn() {
      console.log('login');
      const token = localStorage.getItem('jwt');
      axios.post(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/verify`, { token })
        .then((decode) => {
          this.loggedIn = true;
          const {
            id,
            username,
            email,
            url_avatar,
          } = decode.data;
          this.user = {
            id,
            username,
            email,
            url_avatar,
          };
          this.$socket.emit('login', {
            id,
            username,
            email,
            url_avatar,
          });
          this.links[1].href = `/profile/${id}`;
          return this.getUserLikes(id)
            .then(() => this.getUserFriends(id));
        })
        .catch((err) => err);
    },
    logOut() {
      this.loggedIn = false;
      this.user = null;
      this.$socket.emit('logout');
    },
    newAvatar(avatar) {
      const update = { url_avatar: avatar };
      this.user = { ...this.user, ...update };
    },
    getUserLikes(id) {
      const query = `
  query {
    getLikedSongs(id: ${id}) {
      id, id_author, name, url, count_likes, public, created_at
    }
  }
`;
      return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((result) => {
          this.liked = result.getLikedSongs;
        })
        .catch((err) => console.log(err));
    },
    getUserFriends(id) {
      const query = `
      query {
        getUserFriends(id: ${id}) {
          id, username, email, url_avatar
          }
        }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((result) => {
          const friends = {};
          result.getUserFriends.forEach((friend) => {
            friends[friend.id] = friend;
          });
          this.friends = friends;
        })
        .catch((err) => console.log(err));
    },
    clearNotifications() {
      this.notifications = 0;
    },
    denotify() {
      this.notifications -= 1;
    },
  },
  sockets: {
    connect() {
      console.log('connect');
    },
    updateOnlineUsers(users) {
      this.online = users;
    },
    notified() {
      this.notifications += 1;
    },
    backlog(num) {
      this.notifications = num;
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
      :loggedIn="loggedIn"
      :user="user"
      :notifications="notifications"
      @sidebarChanged="onSidebarChanged"
    >
      <template v-slot:navbar>
        <b-navbar
          id="mainNavbar"
          toggleable="lg"
          fixed="top"
          background-color="#1f1e1d"
        >
          <b-navbar-nav>
            <b-nav-item>
            </b-nav-item>
          </b-navbar-nav>
        </b-navbar>
      </template>

      <template v-slot:content>
        <b-container style="margin-top: 56px">
          <router-view
            :loggedIn="loggedIn"
            :user="user"
            :liked="liked"
            :online="online"
            :friends="friends"
            v-on:new-avatar='newAvatar'
            v-on:new-like="getUserLikes(user.id)"
            v-on:friend="getUserFriends(user.id)"
            v-on:checked="clearNotifications"
            v-on:denotify="denotify"
          />
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
