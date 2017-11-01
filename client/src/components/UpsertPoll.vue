<template>
<div class="create-poll" v-if="isLoggedIn">
  <h2>{{this.isUpdate ? 'Update' : 'Create'}} your poll</h2>
  <input
    type="text"
    v-model="title"
    placeholder="Poll name"
  >
  <div
    v-for="(option, index) in options"
    :key="option.id" class="option-wrapper"
  >
    <input
      type="text"
      class="option"
      v-model="options[index]"
      :placeholder="'Option ' + (index + 1)"
    >
    <button
      @click="removeOption(index)"
      class="remove-button"
      tabindex="-1"
      title="Remove this option"
    >
      <i class="fa fa-trash" aria-hidden="true"></i>
    </button>
  </div>
  <button
    class="create-new-poll"
    @click="submitPoll"
    title="Create new poll"
  >
    {{this.isUpdate ? 'Update' : 'Create'}} poll
  </button>

  <div v-if="userHint" class="user-hint">
    <i class="fa fa-info-circle" aria-hidden="true"></i>
    {{userHint}}
  </div>
</div>
<div v-else style="margin-top: 25vh; color: #333">
  <i class="fa fa-info-circle fa-5x" aria-hidden="true"></i>
  <h1>Please, log in to manage your polls.</h1>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'upsertpoll',
  props: ['pollTitle', 'pollOptions'],
  data: function() {
    return {
      title: this.pollTitle || '',
      options: this.pollOptions || ['']
    };
  },
  watch: {
    options: {
      handler: function() {
        const OPTIONS_MAX = 10;
        const emptyOptions = this.options.filter(el => {
          return el.trim() === '';
        }).length;
        if (emptyOptions === 0 && this.options.length < OPTIONS_MAX) {
          this.options.push('');
        } else if (emptyOptions > 1) {
          this.options.splice(this.options.indexOf(''), 1);
        }
      }
    },
    pollTitle: {
      handler: function() {
        this.title = this.pollTitle;
        this.options = this.pollOptions;
      }
    }
  },
  methods: {
    submitPoll() {
      if (this.checkFormErrors()) {
        console.log('Errors, not submitting!');
        return;
      }
      /* eslint-disable no-undef */
      const submitUrl = `${this.isUpdate
        ? 'update'
        : 'create'}-poll`;
      let submitData = {
        title: this.title,
        options: this.options.filter(el => { return el; })
      };
      if (this.isUpdate) {
        submitData.id = this.$route.params.id;
      }
      axios({
        method: 'post',
        headers: {
          'Authorization': this.token
        },
        url: API_URL + submitUrl,
        data: submitData
      })
        .then(response => {
          this.$router.push('/my-polls');
        })
        .catch(err => {
          return alert('Try to submit poll later: ' + err);
        });
    },
    removeOption(index) {
      if (this.options.length > 1) {
        this.options.splice(index, 1);
      }
    },
    checkFormErrors() {
      const TITLE_MIN_LENGTH = 3;
      const TITLE_MAX_LENGTH = 100;

      const OPTION_MAX_LENGTH = 50;

      const titleErr = this.title.trim().length < TITLE_MIN_LENGTH ||
        this.title.trim().length > TITLE_MAX_LENGTH;
      if (titleErr) {
        return `Title length must be between ${TITLE_MIN_LENGTH}\
         and ${TITLE_MAX_LENGTH} characters`;
      }

      const optionErrs = this.options.filter(el => {
        return el.trim().length > OPTION_MAX_LENGTH;
      }).length;
      if (optionErrs) {
        return `Option length must not be longer than\
          ${OPTION_MAX_LENGTH} characters.`;
      }

      if (this.options.length < 3) {
        return 'Poll must contain at least two options.';
      }

      const doesContainDuplicates = arr => {
        const filtered = arr.filter((el, pos) => {
          return arr.indexOf(el) === pos;
        });
        return !(filtered.length === arr.length);
      };
      if (doesContainDuplicates(this.options)) {
        return 'Poll must contain different options';
      }

      return '';
    }
  },
  computed: {
    userHint() {
      return this.checkFormErrors();
    },
    emptyOptionAvailable() {
      return !!this.options.filter(el => {
        return !el;
      }).length;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    token() {
      return this.$store.getters.token;
    },
    isUpdate() {
      return this.pollTitle || this.pollOptions;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"

.user-hint
  margin 1em
  color orangered

.create-poll
  width 90%
  min-width 300px
  max-width 400px
  margin 3em auto

input, button
  height 40px
  line-height 40px

input
  color #333
  width 100%
  background transparent
  border none
  border-bottom 1px solid grey

.option-wrapper
  width 100%
  display flex
  margin 5px 0
  position relative
  input
    padding 0 21px 0 0

.remove-button
  width 20px
  color orangered
  position absolute
  right 1px

.create-new-poll
  margin-top 1em
  width 100%
  background $banner-green-color
  color white
</style>
