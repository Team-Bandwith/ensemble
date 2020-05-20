<template>
  <b-container fluid>
    <h3>Direct Messages</h3>
    <div>
      <span v-for="dm in dms" :key="dm.id">
        <DirectMessage :dm="dm"></DirectMessage>
      </span>
    </div>
  </b-container>
</template>

<script>
import { request } from 'graphql-request';

import DirectMessage from './DirectMessage.vue';

export default {
  name: 'direct-message-list',
  props: {
    id: Number,
  },
  components: {
    DirectMessage,
  },
  data() {
    return {
      dms: [],
    };
  },
  methods: {
    getUserDMs(id) {
      const query = `query {
        getUserDMs(id: ${id}) {
          id,
          id_user_to,
          id_user_from,
          text,
          created_at,
          username,
          url_avatar
        }
      }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          console.log(res.getUserDMs);
          this.dms = res.getUserDMs;
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.getUserDMs(this.id);
  },
};
</script>

<style>

</style>
