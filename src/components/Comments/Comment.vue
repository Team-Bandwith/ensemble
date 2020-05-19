<template>
  <b-container fluid>
    <b-row>
      <b-col>
       {{comment.text}}
      </b-col>
      <b-col>
        <em>{{handleMoment(comment.created_at).fromNow()}}</em>
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
</style>
