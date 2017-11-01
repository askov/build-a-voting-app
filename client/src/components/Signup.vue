<template>
<div class="form-wrapper">
  <h2>Create your account. It's free.</h2>
  <form v-on:submit.prevent="submit">
    <div class="form-line">
      <i class="fa fa-user-circle-o" aria-hidden="true"></i>
      <input type="text"
             v-bind:class="{ warning: errors.has('displayName') }"
             name="displayName"
             placeholder="Username *"
             v-model="username"
             v-validate="'required|alpha_num|min:3|max:20'"
      >
    </div>
    <div class="help">
      <span v-if="errors.has('displayName')">
        {{errors.first('displayName').replace('displayName', 'Name')}}
      </span>
    </div>
    <div class="form-line">
      <i class="fa fa-envelope-o" aria-hidden="true"></i>
      <input type="text"
             v-bind:class="{ warning: errors.has('email') }"
             name="email"
             placeholder="e-mail *"
             v-on:input="emailRegistered = false"
             v-model="email"
             v-validate="'required|email|min:8|max:32'"
      >
    </div>
    <div class="help" id="email-status">
      <span v-if="emailRegistered">Email is already registered</span>
      <span v-else-if="errors.has('email')">
        {{errors.first('email')}}
      </span>
    </div>
    <div class="form-line">
      <i class="fa fa-key" aria-hidden="true"></i>
      <input type="password"
             v-bind:class="{ warning: errors.has('password') }"
             name="password"
             placeholder="Password *"
             v-model="password"
             v-validate="'required|min:6|max:32'"
      >
    </div>
    <div class="help">
      <span v-if="errors.has('password')">
        {{errors.first('password')}}
      </span>
    </div>
    <input type="submit" value="Sign up">
  </form>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'signup',
  data: function() {
    return {
      emailRegistered: false,
      username: '',
      email: '',
      password: ''
    };
  },
  methods: {
    submit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios({
            method: 'post',
            /* eslint-disable no-undef */
            url: API_URL + 'user',
            data: {
              displayName: this.username,
              email: this.email,
              password: this.password
            }
          })
          .then(response => {
            this.$router.push('/login');
          })
          .catch(() => {
            this.emailRegistered = true;
          });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/form"
</style>


