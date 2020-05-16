<template>
<div class="profileBody">
  <b-row>
    <b-col>
  <div class="profile">
    <ProfileCard v-on:new-avatar='newAvatar' :user='user'/>
  </div>
    </b-col>
  </b-row>
</div>
</template>

<script>
import ProfileCard from '@/components/ProfileCard.vue';

export default {
  name: 'Profile',
  components: {
    ProfileCard,
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

<style scoped>
</style>
