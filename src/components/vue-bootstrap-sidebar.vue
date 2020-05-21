<template>
  <div>
    <!-- Sidebar -->
    <nav
      id="sidebar"
      class="vue-bootstrap-sidebar default-theme"
      :class="[ theme ] && [ show ? 'sidebar-visible' : 'sidebar-hidden' ]"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="sidebar-header"
        v-html="header"
      />
      <!-- eslint-enable -->
      <b-list-group class="items-wrapper">
        <div v-if="!loggedIn">
          <div class='signup-btn'>
          <SignUp v-on:log-in="logIn" />
          </div>
          <div class='login-btn'>
          <Login v-on:log-in="logIn" />
          </div>
        </div>
          <div v-if="loggedIn">
          <img v-if="user.url_avatar" :src="user.url_avatar" />
          <div class='user-name'><b>{{ user.username }}</b></div>
          <div class='logout-btn'>
            <b-button @click="logOut">Logout</b-button>
          </div>
          </div>
        <div v-if="loggedIn">
          <template v-for="(link, index) in links">
            <template v-if="link.href !== undefined">
              <b-list-group-item :key="index">
                <b-button
                  block
                  :to="link.href"
                  variant="info"
                  class="btn sidebar-menu-item"
                  :squared="true"
                >
                <div class="fa-icon">
                  <component
                    v-if="link.faIcon"
                    :is="'font-awesome-icon'"
                    :icon="link.faIcon"
                  />
                </div>
                <div class="link-name">
                  {{ link.name }} {{ link.name === 'Inbox' && notifications
                    ? `(${notifications})` : ''}}
                </div>
              </b-button>
            </b-list-group-item>
          </template>
          <template v-else>
            <b-list-group-item
              :key="index"
            >
              <b-button
                v-b-toggle="`accordion-${link.name}`"
                block
                href="#"
                variant="info"
                class="sidebar-menu-item dropdown-toggle"
              >
                <div class="fa-icon">
                  <component
                    v-if="link.faIcon"
                    :is="'font-awesome-icon'"
                    :icon="link.faIcon"
                  />
                </div>
                <div class="link-name">
                  {{ link.name }}
                </div>
              </b-button>
            </b-list-group-item>
          </template>
        </template>
        </div>
<div>
  <div>
  <div v-if="loggedIn">
      <font-awesome-icon icon='address-book'/>
<v-select label="username" :filterable="false" :options="options" @search="onSearch">
    <template slot="no-options">
      Search for Friends
    </template>
    <template slot="option" slot-scope="option">
      <div class="d-center">
        <b-avatar :src='option.url_avatar'/>
        {{ option.username }}
        </div>
    </template>
    <template slot="selected-option" slot-scope="option">
      <div class="selected d-center">
        <b-avatar :src='option.url_avatar'/>
        {{ option.username }}
      </div>
    </template>
  </v-select>
    </div>
  </div>
</div>
      </b-list-group> <!--/ .items-wrapper -->
      <HamburgerButton
        id="sidebarButton"
        class="sidebar-button"
        :is-hamburger="!initialShow"
        :class="[ show ? 'visible' : 'hidden' ]"
        @click="onButtonClick"
      />
    </nav>
    <div
      id="navbar"
      :class="[ show ? 'sidebar' : 'no-sidebar' ]"
    >
      <slot name="navbar" />
    </div>
    <!-- Hamburger Menu -->
    <div
      id="content"
      :class="[ show ? 'sidebar' : 'no-sidebar' ]"
    >
      <slot name="content" />
    </div>
  </div>
</template>
<script>
// import axios from 'axios';
import HamburgerButton from '@jurajkavka/vue-hamburger-button';
import { _ } from 'vue-underscore';
import { request } from 'graphql-request';
import Login from './Login.vue';
import SignUp from './SignUp.vue';

export default {
  name: 'BootstrapSidebar',
  components: {
    HamburgerButton,
    SignUp,
    Login,
  },
  props: {
    links: {
      type: Array,
      default: null,
    },
    initialShow: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      default: 'default-theme',
    },
    header: {
      type: String,
      default: 'Sidebar',
    },
    loggedIn: Boolean,
    user: Object,
    notifications: Number,
  },
  data() {
    return {
      show: this.initialShow,
      name: '',
      nameState: null,
      options: [],
    };
  },
  methods: {
    onSearch(search, loading) {
      loading(true);
      this.search(loading, search, this);
      console.log(this.options);
    },
    /* eslint-disable prefer-arrow-callback */
    search: _.debounce(function (loading, search) {
      const query = `query {
        getUserName(name:"${search}"){
          id, username, url_avatar
              }
          }`;
      return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          console.log(res);
          loading(false);
          this.options = res.getUserName;
        });
    }, 350),
    onButtonClick() {
      this.show = !this.show;
      this.$emit('sidebarChanged', this.show);
    },
    logOut() {
      this.$emit('log-out');
      localStorage.removeItem('jwt');
      this.$router.push({ path: '/' });
    },
    logIn() {
      this.$emit('log-in');
    },
  },
};
</script>
<style lang="scss">
@import 'node_modules/@jurajkavka/vue-hamburger-button/src/scss/default-theme.scss';

.logo{
  border-radius: 50% 50%;
  width: 100px;
  margin: 0 auto;
  background: #000;
}

img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
.user-name {
  text-align: center;
}

.logout-btn {
   position:fixed;
   right:10px;
   top:7px;
}

.signup-btn {
   position:fixed;
   right:10px;
   top:7px;
}

.login-btn {
   position:fixed;
   right:90px;
   top:7px;
}
</style>
