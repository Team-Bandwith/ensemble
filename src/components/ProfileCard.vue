<template>
  <div class="profile">
    <div class="profile-card">
  <b-card
    class="profile-card"
    no-body
    style="max-width:20rem;
    border:none;
    top:50px;
    right:50px;
    position:fixed;
    background-color: #1f1e1d;"
  >
    <template v-slot:header>
      <img v-if="user.url_avatar" :src="user.url_avatar" />
      <h4 class="mb-0"
        :style="friends[user.id] ? { color: 'green' } : {}"
      >
        {{user.username}}
      </h4>
      <b-button
        v-if="myId !== parseInt(user.id) && !friends[user.id]"
        @click="addFriend"
      >
        Add Friend
      </b-button>
      <div v-else-if="myId !== parseInt(user.id)">
        <b-button @click="removeFriend">Remove Friend</b-button>
        <b-button v-b-modal="`message-history${$route.params.id}`"
        class="message-history">Send Message
          <MessageHistory :userTo="$route.params.id" :myId='myId' :user='user'/>
        </b-button>
      </div>
    </template>
    <b-card-body>
      <b-card-text style="color: white;">
        Some quick example text to build on the card title and make up the bulk of the card's
        content.
      </b-card-text>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item style="border: none; background-color: #1f1e1d;">
        <b-row>
          <b-col cols='7'>
            <div style='font-size: 1.4em;'><b>({{liked.length}})</b></div>
          </b-col>
          <b-col>
            <div style='font-size: 1.4em;'><b>({{contribution}})</b></div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div style='font-size: 1em; color: white;'>likes</div>
          </b-col>
          <b-col>
            <div style='font-size: 1em; color: white;'>contributions</div>
          </b-col>
        </b-row>
        </b-list-group-item>
      <b-list-group-item style="border: none; background-color: #1f1e1d;">
        contact: <b>{{user.email}}</b></b-list-group-item>
    </b-list-group>
    <div class='loader' v-if="myId === parseInt($route.params.id)">
    <b-card-body style="border:none;">
      Upload your Photo Here:
      <PhotoUpload v-on:new-avatar='newAvatar' :user='user'/>
    </b-card-body>
    </div>
    <div style='font-size: 1.5em;'><b>Friends({{friendsData.length}})</b></div>
    <b-card-footer style="border:none; background-color: #1f1e1d;">
    <b-row v-for="row in friendsRow" :key="row[0].id">
      <b-col>
        <b-avatar
        :to="`/profile/${row[0].id}`"
        :src="row[0].url_avatar"
        size="4em"
         />
      </b-col>
      <b-col v-if="row[1]">
        <b-avatar
        :to="`/profile/${row[1].id}`"
        :src="row[1].url_avatar"
        size="4em"
        />
      </b-col>
      <b-col v-if="row[2]">
        <b-avatar
        :to="`/profile/${row[2].id}`"
        :src="row[2].url_avatar"
        size="4em"
        />
      </b-col>
    </b-row>
    </b-card-footer>
  </b-card>
</div>
  </div>
</template>

<script>
import { request } from 'graphql-request';
import PhotoUpload from '@/components/PhotoUpload.vue';
import MessageHistory from './MessageHistory.vue';

export default {
  name: 'ProfileCard',
  components: {
    PhotoUpload,
    MessageHistory,
  },
  data() {
    return {
      friendsRow: [],
    };
  },
  props: {
    user: Object,
    myId: Number,
    friends: Object,
    friendsData: Array,
    contribution: Number,
    liked: Array,
  },
  watch: {
    friendsData() {
      let index = 0;
      const rows = [];
      while (this.friendsData.slice(index, index + 3).length) {
        rows.push(this.friendsData.slice(index, index + 3));
        index += 3;
      }
      this.friendsRow = rows;
    },
  },
  methods: {
    newAvatar(avatar) {
      this.$emit('new-avatar', avatar);
    },
    addFriend() {
      const query = `
      query {
        checkRequest(id_user_to: ${this.$route.params.id}, id_user_from: ${this.myId}) {
          id
        }
      }`;

      const mutation = `
      mutation {
        addFriend(id_user_to: ${this.$route.params.id}, id_user_from: ${this.myId}) {
          id
        }
      }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, query)
        .then(() => alert("You've already sent this user a friend request."))
        .catch(() => request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation))
        .then(() => {
          this.$emit('friend');
        })
        .then(() => {
          const reverseCheck = `
          query {
            checkRequest(id_user_to: ${this.myId}, id_user_from: ${this.$route.params.id}) {
              id
            }
          }`;

          return request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, reverseCheck);
        })
        .then(() => {
          this.$socket.emit('notify', this.$route.params.id);
          this.$emit('denotify');
          const confirm = `
          mutation {
            sendMessage(id_user_to: ${this.$route.params.id},
            id_user_from: 1,
            text: "${this.user.username} has confirmed your friend request!") {
              id
            }
          }`;

          request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, confirm);
        })
        .catch(() => this.$socket.emit('notify', this.$route.params.id));
    },
    removeFriend() {
      const mutation = `
      mutation {
        removeFriend(id_user_to: ${this.$route.params.id}, id_user_from: ${this.myId}) {
          id
        }
      }`;

      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation)
        .then(() => {
          this.$emit('friend');
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style scoped>
.profile-card {
  color:#99aca0;
}
</style>
