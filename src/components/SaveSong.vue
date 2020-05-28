<template>
  <div>
    <b-modal
      id="save-song"
      ref="modal"
      title="Save Your Song"
      @show="showModal"
      @hidden="closeModal"
      @ok="handleOk"
      hide-footer
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
          label="Make song public?"
          label-for="public-input"
        >
          <b-form-checkbox
            id="public-input"
            v-model="sharePublic"
            :state="publicState"
            required
          ></b-form-checkbox>
        </b-form-group>
        <b-button
        class="mt-3 save-button" block
        @click="handleOk">Save</b-button>
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
    users: Array,
  },
  methods: {
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      this.publicState = valid;
      return valid;
    },
    showModal() {
      this.name = '';
      this.nameState = null;
      this.sharePublic = true;
      this.publicState = null;
    },
    closeModal() {
      this.name = '';
      this.nameState = null;
      this.sharePublic = true;
      this.publicState = null;
      this.$emit('active');
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
        .then((res) => Promise.all(this.users.map((ctb) => {
          const makeContrib = `
          mutation {
            makeContribution(id_user: ${ctb.id}, id_song: ${res.addSong.id}) {
              id
            }
          }`;

          return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, makeContrib);
        })))
        .catch((err) => console.log(err));
      // Hide the modal manually
      this.$nextTick(() => {
        this.$emit('active');
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
#save-song {
  background-color: #1f1e1d;
}
</style>
