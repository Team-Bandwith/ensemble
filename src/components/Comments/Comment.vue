<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <!-- <div class="av-img">
          <b-avatar v-if="comment.url_avatar" :src="comment.url_avatar" />
        </div> -->
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="spacer"></div>
        <div class="creds">
          <div class="user-link">
            <router-link :to="`/profile/${comment.id_user}`">
              {{ comment.username + ':' }}
            </router-link>
          </div>
          <div class="comment-text">
            <p>{{comment.text}}</p>
          </div>
        </div>
        <div class="moment">
            <em>{{handleMoment(comment.created_at).fromNow()}}</em>
          </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

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
  color: #fff;
}
.comment-text p {
  max-width: 100px;
}
.spacer {
  float: left;
  width: 18%;
}
.creds {
  width: 82%;
  float: left;
  height: 100%;
}
.moment{
  float: right;
  color: #fff;
  font-size: .5em;
}
.user-link a {
  float: left;
  color: #6b8554
}
.user-link a:hover {
  color: #fff;
}

</style>
