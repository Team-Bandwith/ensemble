<template>
<div v-if='contribution.length > 0'>
    <b-list-group
    style="max-height:100px;">
    <b-list-group-header class='contribs' style="background-color: #1f1e1d;">
        Contributing Artist
    </b-list-group-header>
      <b-container fluid
      style="background-color: #1f1e1d;">
        <b-list-group-item
        v-for="contrib in contribution"
        :key="contrib.id">
        <span v-b-modal="`contrib${contrib.id}`"
        style="font-size: 1.7rem; overflow: auto; font-weight: bold;"
        >{{contrib.name}}</span>
        <b-modal
        :id="`contrib${contrib.id}`"
        hide-footer="true"
        hide-header="true"
        >
            <Song
            style="background-color: white;"
            :myId='myId'
            :song='contrib'
            :liked='liked'
            :user='user'
            v-on:new-like='newLike'
            v-on:unlike='unlike'
            />
        </b-modal>
        </b-list-group-item>
      </b-container>
    </b-list-group>
</div>
</template>


<script>
import { request } from 'graphql-request';
import Song from './Song.vue';

export default {
  name: 'ContribList',
  data() {
    return {
      contribution: [],
      isPlaying: false,
      player: null,
      bodyBgVariant: 'dark',
    };
  },
  components: {
    Song,
  },
  props: {
    user: Object,
    myId: Number,
    liked: Array,
  },
  methods: {
    newLike(songId) {
      this.$emit('new-like', songId);
    },
    unlike(songId) {
      this.$emit('unlike', songId);
    },
    getContribution(id) {
      const contribQuery = `query {
            getUserContribs(id:${id}){
              id, name, url, id_author, count_likes, public, created_at
              }
            }`;
      return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, contribQuery)
        .then((res) => {
          this.contribution = res.getUserContribs;
          this.$emit('num-contribs', res.getUserContribs.length);
        }).catch((err) => console.log(err, 'failed to receive contribs'));
    },
  },
  created() {
    this.getContribution(this.$route.params.id);
  },
  watch: {
    user(val) {
      this.getContribution(val.id);
    },
  },
};
</script>
<style scoped>
div {
    margin-bottom: 1em;
    background-color:#98AC9E;
}
.contribs{
  font-size: 1.5rem;
  color: #99aca0;
}
</style>
