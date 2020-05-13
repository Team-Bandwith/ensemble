<template>
  <div class="cl-upload">
    <div v-show="showProgress">
      <progress-bar :options="options" :value="progress" />
    </div>
    <form v-on:submit.prevent="upload">
      <!-- allow the user to select an image file and when they have selected it call a function
      to handle this event-->
      <label for="file-input">Upload:</label>
      <input
        id="file-input"
        type="file"
        accept="image/png, image/jpeg"
        @change="handleFileChange($event)"
      />
      <!-- submit button is disabled until a file is selected -->
      <button type="submit" :disabled="filesSelected < 1">Upload</button>
    <!-- display uploaded image if successful -->
    <section v-if="results && results.secure_url">
      <img :src="results.secure_url" :alt="results.public_id" />
    </section>
    </form>
  </div>
</template>
<script>
import axios from 'axios';


export default {
  name: 'PhotoUpload',
  components: {
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
      progress: 0,
      showProgress: false,
      fileContents: null,
      formData: null,
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
      this.formData.append('tags', this.tags); // Optional - add tag for image admin in Cloudinary
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
          };
          // show progress bar at beginning of post
          this.showProgress = true;
          axios(requestObj)
            .then((response) => {
              this.results = response.data;
              console.log(this.results);
              console.log('public_id', this.results.public_id);
            })
            .catch((error) => {
              this.errors.push(error);
              console.log(this.error);
            })
            .finally(() => {
              setTimeout(
                () => {
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
input {
  padding: 0.7em;
  margin-bottom: 0.5rem;
}
input:focus {
  outline: 3px solid gold;
}
@media (min-width: 400px) {
  form {
    grid-template-columns: 150px 1fr;
    grid-gap: 16px;
  }
  label {
    text-align: right;
    grid-column: 1 / 2;
  }
  input,
  button {
    grid-column: 2 / 3;
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
  max-width: 300px;
  height: auto;
}
</style>
