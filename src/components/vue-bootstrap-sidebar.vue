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
                  {{ link.name }}
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
    <b-button v-b-modal.modal-prevent-closing>Open Modal</b-button>


    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Find Friends"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Enter a Name or User Name"
          label-for="name-input"
          invalid-feedback="Name is required"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
    <div class="mt-3">
      Names:
      <div v-if="submittedNames.length === 0"></div>
      <ul v-else class="mb-0 pl-3">
        <li v-bind:key="name" v-for="name in submittedNames">{{ name }}</li>
      </ul>
    </div>

        </b-form-group>
      </form>
    </b-modal>
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
  },
  data() {
    return {
      show: this.initialShow,
      name: '',
      nameState: null,
      submittedNames: [],
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    resetModal() {
      this.name = '';
      this.nameState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // Push the name to submitted names
      this.submittedNames.push(this.name);
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing');
      });
    },
  },
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
