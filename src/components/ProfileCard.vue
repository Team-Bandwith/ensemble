<template>
  <div class="profile">
    <div class="profile-card">
  <b-card
    class="profile-card"
    no-body
    style="width:20rem;
    max-width: 20rem;
    border:none;
    top:50px;
    right:50px;
    position:fixed;
    background-color: #1f1e1d;"
  >
    <template v-slot:header style="opacity: 0; border:none;">
      <b-avatar
      :src="user.url_avatar"
      :badge="myId === parseInt(user.id)"
      badge-offset="-0.5em"
      badge-variant="dark"
      class="justify-center"
      size='115px'>
      <template v-if="myId === parseInt(user.id)" v-slot:badge>
        <PhotoUpload v-on:new-avatar='newAvatar' :user='user'/></template>
      </b-avatar>
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
      <b-toast id="request-sent" title="Success!" auto-hide-delay="2000">
        Friend request sent.
      </b-toast>
      <b-toast id="error" title="Hey!" auto-hide-delay="2000">
        You already sent a friend request to this user.
      </b-toast>
    </template>
    <b-card-body class="field">
      <label>Bio:</label>
        <b-card-text
          style="color: white;"
          v-model="bio">
          {{newBio || user.bio}}
      </b-card-text>
      <div v-if="myId === parseInt(user.id)">
          <EditBioModal :bio="newBio || user.bio" v-on:editBio="editBio"/>
      </div>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item style="border: none; background-color: #1f1e1d;">
        <b-row>
          <b-col cols='7'>
            <div style='font-size: 1.4em;'><b>({{myLikes}})</b></div>
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
      <!-- <b-list-group-item style="border: none; background-color: #1f1e1d;">
        <b-row align-h="end">
          <b-col cols="4">
            <div style='text-align: right; color:white;'>
        contact:
            </div>
          </b-col>
          <b-col cols="8">
            <div style="text-align: left;">
        <b>{{user.email}}</b>
            </div>
          </b-col>
        </b-row>
        </b-list-group-item> -->
    </b-list-group>
    <div class='loader' v-if="myId === parseInt($route.params.id)">
    </div>
    <div style='font-size: 1.5em; padding: 1em;'><b>Friends({{friendsData.length}})</b></div>
    <b-card-footer style="border:none; background-color: #1f1e1d;">
    <b-row v-for="row in friendsRow" :key="row[0].id" class='mb-3'>
      <b-col cols="4">
        <b-avatar
        :to="`/profile/${row[0].id}`"
        :src="row[0].url_avatar"
        size="4em"
      />
      </b-col>
      <b-col v-if="row[1]" cols="4">
        <b-avatar
        :to="`/profile/${row[1].id}`"
        :src="row[1].url_avatar"
        size="4em"
        />
      </b-col>
      <b-col v-if="row[2]" cols="4">
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
import EditBioModal from './EditBioModal.vue';

export default {
  name: 'ProfileCard',
  components: {
    PhotoUpload,
    MessageHistory,
    EditBioModal,
  },
  data() {
    return {
      newBio: null,
      friendsRow: [],
    };
  },
  props: {
    user: Object,
    myId: Number,
    friends: Object,
    friendsData: Array,
    contribution: Number,
    myLikes: Number,
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
    editBio(value) {
      const mutation = `
        mutation {
          editBio(bio: "${value}", id: ${this.myId}) {
            id
            }
        }`;
      request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation)
        .then(() => {
          this.newBio = value;
        })
        .catch((err) => console.log(err));
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
        .then(() => this.$bvToast.show('error'))
        .catch(() => request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, mutation))
        .then((res) => {
          this.$emit('friend');
          if (res) {
            this.$bvToast.show('request-sent');
          }
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
.b-avatar {
  background-color: #1f1e1d;
}
</style>
