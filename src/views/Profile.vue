<template>
<div class="profileBody">
  <b-row>
    <b-col>
  <div class="profile">
    <ProfileCard v-on:new-avatar='newAvatar' :user='user'/>
  </div>
  <div class="user-song">
    <SongsList :loggedIn="loggedIn" />
  </div>
    </b-col>
  </b-row>
</div>
</template>

<script>
import ProfileCard from '@/components/ProfileCard.vue';
import SongsList from '@/components/SongsList.vue';

export default {
  name: 'Profile',
  components: {
    ProfileCard,
    SongsList,
  },
  props: {
    user: Object,
    loggedIn: Boolean,
  },
  methods: {
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
  },
};
</script>

<style scoped>
user-song {
  overflow: hidden;
}
</style>
