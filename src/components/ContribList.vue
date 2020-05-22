<template>
<div style="width: 20rem; right: 50px; position: fixed; bottom: 50px;">
    <b-list-group>
    <b-list-group-header>
        Contributions:
    </b-list-group-header>
        <b-list-group-item
        v-for="contrib in contribution"
        :key="contrib.id">
        <span v-b-modal="`contrib${contrib.id}`">{{contrib.name}}</span>
        <b-modal :id="`contrib${contrib.id}`">
            <Song
            :myId='myId'
            :song='contrib'
            :liked='liked'
            :user='user'
            v-on:new-like='newLike'
            />
        </b-modal>
        </b-list-group-item>
        <b-list-group-footer>
            <hr/>
        </b-list-group-footer>
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
    newLike() {
      this.$emit('new-like');
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
    console.log('Im created', this.$route.params.id);
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
    background-color:aliceblue;
}
</style>
