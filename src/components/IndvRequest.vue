<template>
  <b-container >
    <b-list-group flush>
      <div class="indv-request">
        <b-list-group-item variant="dark">
          <b-avatar :src="request.url_avatar" class="mr-3" />
            <span class="mr-auto">
              <router-link :to="`/profile/${request.id}`">
              {{ request.username }}
              </router-link>
              sent you a friend request!
            </span>
            <b-button variant="success" @click="addFriend">Accept</b-button>
            <b-button variant="danger" @click="removeFriend">Deny</b-button>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-container>
</template>

<script>
import { request } from 'graphql-request';

export default {
  name: 'IndvRequest',
  props: {
    request: Object,
    id: Number,
    user: Object,
  },
  methods: {
    addFriend() {
      const mutation = `
      mutation {
        addFriend(id_user_to: ${this.request.id}, id_user_from: ${this.id}) {
          id
        }
      }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation)
        .then(() => {
          this.$emit('friend');
          this.$socket.emit('notify', this.request.id);

          const confirm = `
          mutation {
            sendMessage(id_user_to: ${this.request.id},
            id_user_from: 1,
            text: "${this.user.username} has confirmed your friend request!") {
              id
            }
          }`;

          request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, confirm);
        })
        .catch((err) => console.log(err));
    },
    removeFriend() {
      const mutation = `
      mutation {
        removeFriend(id_user_to: ${this.request.id}, id_user_from: ${this.id}) {
          id
        }
      }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation)
        .then(() => this.$emit('friend'))
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style>

</style>
