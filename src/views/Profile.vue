/* eslint-disable max-len */
<template>
<b-container fluid class="profileBody">
  <b-row align-h="around">
    <b-col cols='7'>
  <div class="user-song">
    <UserSongsList
      v-if='user'
      :loggedIn="loggedIn"
      :liked="liked"
      :user="profileUser || user"
      :myId="user.id"
      v-on:new-like="newLike"
      />
  </div>
    </b-col>
    <b-col col='4'>
    <div class="profile">
    <ProfileCard v-if='user'
     v-on:new-avatar='newAvatar'
     v-on:friend='newFriend'
     v-on:denotify="denotify"
     :user='profileUser || user'
     :myId='user.id'
     :friends="friends"
     :friendsData="friendsData"
     :contribution="contribution"
     :liked="liked"
    />
    </div>
    </b-col>
  </b-row>
  <b-row >
    <b-col cols='7'>
  <div class="contrib-list">
    <ContribList v-if='user'
    :user="profileUser || user"
    :myId="user.id"
    :liked="liked"
    v-on:new-like='newLike'
    v-on:num-contribs='setContribs'
    />
  </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { request } from 'graphql-request';
import ProfileCard from '@/components/ProfileCard.vue';
import ContribList from '@/components/ContribList.vue';
import UserSongsList from '../components/UserSongsList.vue';

export default {
  name: 'Profile',
  data() {
    return {
      friendsData: [],
      profileUser: null,
      contribution: 0,
    };
  },
  components: {
    ProfileCard,
    UserSongsList,
    ContribList,
  },
  props: {
    user: Object,
    loggedIn: Boolean,
    liked: Array,
    friends: Object,
  },
  methods: {
    setContribs(num) {
      this.contribution = num;
    },
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
    newLike() {
      this.$emit('new-like');
    },
    getUserInfo(id) {
      const query = `query {
        getUserId(id:${id}){
          id, username, url_avatar, email
        }
      }`;
      return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          this.profileUser = res.getUserId;
          const querys = `query {
            getUserFriends(id:${id}){
              id, username, url_avatar, email
              }
            }`;
          return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, querys);
        }).then((res) => {
          this.friendsData = res.getUserFriends;
        });
    },
    newFriend() {
      this.$emit('friend');
    },
    denotify() {
      this.$emit('denotify');
    },
  },
  mounted() {
    this.$emit('friend');
  },
  beforeRouteUpdate(to, from, next) {
    this.getUserInfo(to.params.id)
      .then(() => next());
  },
  created() {
    this.getUserInfo(this.$route.params.id);
  },
};
</script>

<style scoped>
user-song {
  overflow: hidden;
}
</style>
