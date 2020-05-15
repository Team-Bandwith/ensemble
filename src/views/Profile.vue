<template>
  <b-row>
    <b-col>

  <div class="profile">
    <h1>This is the profile page</h1>
    <PhotoUpload v-on:new-avatar='newAvatar' :user='user'/>
  </div>
    </b-col>
  </b-row>
</template>

<script>
import PhotoUpload from '@/components/PhotoUpload.vue';


export default {
  name: 'Profile',
  components: {
    PhotoUpload,
  },
  props: {
    user: Object,
  },
  methods: {
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
  },
};
</script>
