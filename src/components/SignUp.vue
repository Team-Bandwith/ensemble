<template>
  <div>
    <b-button v-b-modal.modal-prevent-closing>Signup</b-button>

    <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Create an Account"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="usernameState"
          label="Username"
          label-for="name-input"
          invalid-feedback="Username is required"
        >
          <b-form-input
            id="name-input"
            v-model="username"
            :state="usernameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="emailState"
          label="E-mail"
          label-for="email-input"
          invalid-feedback="E-mail is required"
        >
          <b-form-input
            type="email"
            id="email-input"
            v-model="email"
            :state="emailState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="pwdState"
          label="Password"
          label-for="pwd-input"
          invalid-feedback="Password is required"
        >
          <b-form-input
            id="pwd-input"
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
      email: '',
      emailState: null,
      password: '',
      pwdState: null,
    };
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.usernameState = valid;
      this.emailState = valid;
      this.pwdState = valid;
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
      /* eslint-disable camelcase */
      // Exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }

      const addMember = `
  mutation {
    signUp(username: "${this.username}", email: "${this.email}", password: "${this.password}") {
      token
    }
  }
`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, addMember)
        .then((res) => {
          localStorage.setItem('jwt', res.signUp.token);
          this.$emit('log-in');
        })
        .catch((err) => console.log(err));
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing');
      });
    },
  },
};
</script>

<style scoped>
.modal {
  border: 1px solid forestgreen;
}
</style>
