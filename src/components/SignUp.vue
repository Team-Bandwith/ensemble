<template>
  <div class="modal" v-show="value">
    <div class="container">
      <div class="modal__title">Sign Up:</div>
      <form>
        Name:
        Email:
      </form>
      <button class="btn">Submit</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SignUp',
  props: {
    value: {
      required: true,
    },
    methods: {
      close() {
        this.$emit('input', !this.value);
      },
    },
  },
};

</script>
<style scoped>
  .modal{
    border: 1px solid forestgreen;
  }
</style>
