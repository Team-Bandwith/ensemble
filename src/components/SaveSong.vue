<template>
  <div>
    <b-modal
      id="save-song"
      ref="modal"
      title="Create an Account"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="nameState"
          label="Song name"
          label-for="name-input"
          invalid-feedback="Song name is required"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
         <b-form-group
          :state="publicState"
          label="Public?"
          label-for="public-input"
        >
          <b-form-checkbox
            id="public-input"
            v-model="sharePublic"
            :state="publicState"
            required
          ></b-form-checkbox>
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
      name: '',
      nameState: null,
      sharePublic: true,
      publicState: null,
    };
  },
  props: {
    cloudURL: String,
    id: Number,
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.publicState = valid;
      return valid;
    },
    resetModal() {
      this.name = '';
      this.nameState = null;
      this.sharePublic = true;
      this.publicState = null;
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

      const addSong = `
  mutation {
    addSong(id_author: ${this.id}, name: "${this.name}", url: "${this.cloudURL}", public: ${this.sharePublic}) {
      id, id_author
    }
  }
`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, addSong)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
      // Hide the modal manually
      this.$nextTick(() => {
        this.$bvModal.hide('save-song');
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
