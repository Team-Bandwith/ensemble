<template>
  <b-container >
    <b-row>
    <b-list-group flush>
      <div>
        <b-list-group-item id="indv-request">
          <b-col>
          <b-avatar :src="request.url_avatar" class="mr-3 indv-request" />
            <span class="mr-auto">
              <router-link :to="`/profile/${request.id}`" id="user-name">
              {{ request.username }}
              </router-link>
            </span>
            <span class="user-text">
              sent you a friend request!
            </span>
            <div id="indv-request">
            <button id="accept" @click="addFriend">Accept</button>
            <button id="deny" @click="removeFriend">Deny</button>
            </div>
    </b-col>
        </b-list-group-item>
      </div>
    </b-list-group>
    </b-row>
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
#indv-request {
  background-color: #1f1e1d;
}
#user-name {
  color: #99aca0;
  font-size: 25px;
}
.user-text {
  color: white;
  font-size: 25px;
}
.time {
  font-size: 15px;
}
#accept {
  color: white;
  background-color: #6d8657;
  border-color: #6d8657;
  margin-right: 10px;
  margin-left: 65px;
}
#deny {
  color: white;
  background-color: #fd5457;
  border-color: #fd5457;
}
</style>
