<template>
<div class="profileBody">
  <b-row>
    <b-col>
  <div class="profile">
    <ProfileCard v-on:new-avatar='newAvatar' :user='user'/>
  </div>
  <div class="user-song">
    <SongsList msg="Welcome to Ensemble"
      :loggedIn="loggedIn"
      :liked="liked"
      :user="user"
      v-on:new-like="newLike"
      />
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
    liked: Array,
  },
  methods: {
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
    newLike() {
      this.$emit('new-like');
    },
  },
};
</script>

<style scoped>
user-song {
  overflow: hidden;
}
</style>
