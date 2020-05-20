<template>
  <b-container fluid>
    <h3>Invitations to Jam</h3>
    <div>
      <span v-for="invite in invites" :key="invite.id">
        <IndvInvite :invite="invite"></IndvInvite>
      </span>
    </div>
  </b-container>
</template>

<script>
import { request } from 'graphql-request';

import IndvInvite from './IndvInvite.vue';

export default {
  name: 'jam-invite',
  props: {
    loggedIn: Boolean,
    id: Number,
  },
  components: {
    IndvInvite,
  },
  data() {
    return {
      invites: [],
    };
  },
  methods: {
    getAllInvites(id) {
      const query = `query {
      getAllInvites (id: ${id}) {
        id,
        id_user_to,
        id_user_from,
        link,
        created_at,
        username,
        url_avatar
      }
    }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then((res) => {
          console.log(res.getAllInvites);
          this.invites = res.getAllInvites;
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.getAllInvites(this.id);
  },
};
</script>

<style>

</style>
