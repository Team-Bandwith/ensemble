<template>
  <div>
    <b-button id="show-btn" @click="$bvModal.show('edit-bio')">Edit Bio</b-button>
    <b-modal
      id="edit-bio"
      title="Edit Bio"
      hide-footer
    >
    <form>
      <b-form-group>
        <div class="current-bio">
        Current Bio: {{this.bio}}
        </div>
      <b-form-input
          class="edit-bio"
          v-model="text"
          placeholder="change your bio">

      </b-form-input>
      <b-button class="mt-3" @click="editBio" v-on:click="emitToParent">Submit Bio</b-button>
      </b-form-group>
    </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'editBio',
  props: {
    bio: String,
  },
  data() {
    return {
      text: '',
    };
  },
  methods: {
    editBio() {
      this.bio = this.text;
    },
    emitToParent() {
      this.$emit('editBio', this.text);
    },
  },
};
</script>

<style scoped>
.current-bio {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
</style>
