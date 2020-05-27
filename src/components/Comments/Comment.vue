<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <div class="av-img">
          <b-avatar v-if="comment.url_avatar" :src="comment.url_avatar" />
        </div>
        <div class="comment-text">
          {{comment.text}}
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="spacer"></div>
        <div class="creds">
          <div class="user-link">
            <router-link :to="`/profile/${comment.id_user}`">
              {{ comment.username }}
            </router-link>:
          </div>
          <div class="moment">
            <em>{{handleMoment(comment.created_at).fromNow()}}</em>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

// import { request } from 'graphql-request';

const moment = require('moment');

export default {
  name: 'Comment',
  props: {
    loggedIn: Boolean,
    comment: Object,
  },
  data() {
    return {
      handleMoment: moment,
    };
  },
  methods: {
  },
};
</script>

<style>
.comment-text {
  width: 82%;
  float: left;
  height: 100%;
  padding: .5em;
}
.av-img  {
  max-width: 18%;
  float: left;
}
.spacer {
  float: left;
  width: 18%;
}
.creds{
  width: 82%;
  float: left;
  height: 100%;
  padding: .5px;
}
.moment{
  float: left;
}
.user-link {
  float: left;
}

</style>
