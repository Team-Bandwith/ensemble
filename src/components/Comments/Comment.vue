<template>
  <b-container fluid>
    {{comment.text}}
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
