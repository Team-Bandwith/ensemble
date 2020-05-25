<template>
  <div class="cl-upload">
    <b-button v-b-modal.modal-prevent-closing>Upload</b-button>
    <b-modal
      class='upload-modal'
      id="modal-prevent-closing"
      size="med"
      ref="modal"
      title="Upload your Avatar"
      hide-footer="true"
      >
    <form v-on:submit.prevent="upload">
      <!-- allow the user to select an image file and when they have selected it call a function
      to handle this event-->
      <b-container>
        <b-row>
          <b-col>
      <input
        id="file-input"
        type="file"
        size="sm"
        accept="image/png, image/jpeg"
        @change="handleFileChange($event)"
      />
      </b-col>
      <!-- submit button is disabled until a file is selected -->
      <b-col>
      <b-button
        size="sm"
        type="submit"
        :disabled="filesSelected < 1" >OK
        </b-button>
      </b-col>
        </b-row>
        </b-container>
      <div v-show="showProgress">
      <loading-progress
        :progress="progress"
        :indeterminate="indeterminate"
        shape="line"
        size="200"
        width="400"
        height="15"
        fill-duration="2"
      />
        </div>
    </form>
   </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import { request } from 'graphql-request';


export default {
  name: 'PhotoUpload',
  components: {
  },
  props: {
    user: Object,
  },
  data() {
    return {
      results: null,
      errors: [],
      file: null,
      filesSelected: 0,
      cloudName: 'my-ensemble',
      preset: 'ensemble',
      tags: 'browser-upload',
      fileContents: null,
      formData: null,
      progress: 0,
      showProgress: false,
      indeterminate: true,
    };
  },
  methods: {
    // function to handle file info obtained from local
    // file system and set the file state
    handleFileChange(event) {
      // returns an array of files even though multiple not used
      /* eslint-disable prefer-destructuring */
      this.file = event.target.files[0];
      this.filesSelected = event.target.files.length;
    },
    prepareFormData() {
      this.formData = new FormData();
      this.formData.append('upload_preset', this.preset);
      this.formData.append('tags', this.tags);
      this.formData.append('file', this.fileContents);
    },
    // function to handle form submit
    upload() {
      // no need to look at selected files if there is no cloudname or preset
      if (this.preset.length < 1 || this.cloudName.length < 1) {
        this.errors.push('You must enter a cloud name and preset to upload');
        return;
      }
      // clear errors
      this.errors = [];
      /* eslint-disable-console */
      const reader = new FileReader();
      // attach listener to be called when data from file
      reader.addEventListener(
        'load',
        () => {
          this.fileContents = reader.result;
          this.prepareFormData();
          const cloudinaryUploadURL = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
          const requestObj = {
            url: cloudinaryUploadURL,
            method: 'POST',
            data: this.formData,
            onUpload(progressEvent) {
              this.progress = Math.round((progressEvent.loaded * 100.0) / progressEvent.total);
            },
          };
          // show progress bar at beginning of post
          this.showProgress = true;
          axios(requestObj)
            .then((response) => {
              this.results = response.data;
              console.log(this.results.url, 'THIS IS THE REPONSE DATA IM LOOKING FOR');
              const addAvatar = `
      mutation {
        storeAvatar( url_avatar: "${this.results.url}", id: ${this.user.id} ){
          url_avatar, token
          }
        }
        `;
              request(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : ''}/api`, addAvatar)
                .then((res) => {
                  this.$emit('new-avatar', res.storeAvatar.url_avatar);
                  localStorage.setItem('jwt', res.storeAvatar.token);
                  this.$bvModal.hide('modal-prevent-closing');
                })
                .catch((err) => console.error('error handling avatar', err));
              console.log('public_id', this.results.public_id);
            })
            .catch((error) => {
              this.errors.push(error);
              console.log(this.error, 'ERROR IN HANDLING AVATAR');
            })
            .finally(() => {
              setTimeout(
                () => {
                  console.log('progress is hitting');
                  this.showProgress = false;
                },
                1000,
              );
            });
        },
        false,
      );
      // call for file read if there is a file
      if (this.file && this.file.name) {
        reader.readAsDataURL(this.file);
      }
    },
  },
  computed: {
    progressModel: {
      get() {
        return this.progress * 100;
      },
      set(value) {
        this.progress = value / 100;
      },
    },
    progressDisplay() {
      return `${Math.round(this.progress * 100)}%`;
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
cl-upload {
  width: 50vw;
}
form input {
  background: #fff;
  border: 1px solid #9c9c9c;
}
form button {
  background-color: blue;
  color: white;
  font-size: 1em;
  font-weight: bold;
  padding: 0.7em;
  width: 10%;
  border: 0;
}
form button:hover {
  background: gold;
  color: black;
}
label {
  padding: 0.5em 0.5em 0.5em 0;
}
/* input {
  padding: 0.7em;
  margin-bottom: 0.5rem;
} */
input:focus {
  outline: 3px solid gold;
}
@media (min-width: 400px) {
  form {
    grid-template-columns: 120px 1fr;
    grid-gap: 8px;
  }
  label {
    text-align: right;
    grid-column: 1 / 2;
  }
  input,
  button {
    grid-column: 1 / 3;
  }
}
button {
  background-color: blue;
  color: white;
  font-weight: bold;
  border-radius: 10px;
}
button:focus {
  outline: none;
}
form button:disabled,
form button[disabled] {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
}
section {
  margin: 10px 0;
}
img {
  max-width: 150px;
  height: 150px;
  border-radius: 50%;
}
.vue-progress-path path {
  stroke-width: 12;
}

.vue-progress-path .progress {
  stroke: red;
}

.vue-progress-path .background {
  stroke: #edd;
}
.vue-progress-path.indeterminate path{transition:none}
</style>
