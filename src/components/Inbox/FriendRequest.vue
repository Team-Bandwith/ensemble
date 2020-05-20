<template>
  <b-container fluid>
    <h3>Friend Requests</h3>
    <div>
      <span v-for="request in requests" :key="request.id">
        <IndvRequest
          :request="request"
          :id="id"
          v-on:friend="newFriend"
        />
      </span>
    </div>
  </b-container>
</template>

<script>
import { request } from 'graphql-request';
import IndvRequest from './IndvRequest.vue';

export default {
  name: 'friend-request',
  components: {
    IndvRequest,
  },
  props: {
    id: Number,
  },
  data() {
    return {
      requests: [],
    };
  },
  methods: {
    getFriendRequests(id) {
      const query = `query {
      getFriendRequests(id: ${id}) {
        id,
        username,
        email,
        url_avatar
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          console.log(res);
          this.requests = res.getFriendRequests;
        })
        .catch((err) => console.log(err));
    },
    newFriend() {
      this.getFriendRequests(this.id);
      this.$emit('friend');
    },
  },
  created() {
    this.getFriendRequests(this.id);
  },
};
</script>

<style>

</style>
