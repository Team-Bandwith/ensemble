<template>
  <div class="sign-in-alt-text">
     <font-awesome-icon
        icon="sign-in-alt"
        class="sign-in-alt align-top"
        size="2x"
        v-b-modal.login
    /> Login
    <b-modal
      id="login"
      ref="modal1"
      title="Please Login"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="usernameState"
          label="Username"
          label-for="username-input"
          invalid-feedback="Username is required"
        >
          <b-form-input
            id="username-input"
            v-model="username"
            :state="usernameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="pwdState"

          label="Password"
          label-for="password-input"
          invalid-feedback="Password is required"
        >
          <b-form-input
            id="password-input"
            v-model="password"
            type="password"
            :state="pwdState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { request } from 'graphql-request';

export default {
  data() {
    return {
      username: '',
      usernameState: null,
      password: '',
      pwdState: null,
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.usernameState = valid;
      this.pwdState = valid;
      return valid;
    },
    resetModal() {
      this.username = '';
      this.usernameState = null;
      this.password = '';
      this.pwdState = null;
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      /* eslint-disable camelcase */
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      const query = `
  query {
    logIn(username: "${this.username}", password: "${this.password}") {
      auth,
      token
    }
  }
`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          if (!res.logIn) {
            alert('Username not found.');
          }

          if (!res.logIn.auth) {
            alert('Incorrect password.');
          } else {
            localStorage.setItem('jwt', res.logIn.token);

            this.$emit('log-in');

            if (this.$route.params.nextUrl != null) {
              this.$router.push(this.$route.params.nextUrl);
            }
          }
        })
        .catch((err) => console.log(err));
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('login');
      });
    },
  },
};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
.sign-in-alt{
  color: #fff;
}
.sign-in-alt-text {
  color: #fff;
  margin-right: 35px;

}
</style>
