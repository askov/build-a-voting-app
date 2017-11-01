<template>
<div>
  <div v-if="voted" class="vote-status">You voted for {{voted}} &#x2665;</div>
  <div v-if="!isVoteFirst()">
    <h2>{{ title }}</h2>
    <piechart :options="options" :votes="votes"></piechart>
  </div>
  <div v-else class="vote-status">Your vote will be first!</div>
  <div class="form-container">
    <form v-if="!voted">
      <div v-for="option in options" :key="option.id" class="choice-container">
        <input
          type="radio"
          name="option"
          :value="option"
          :id="'choice_' + option"
          :key="option.id"
          v-model="picked"
        >
        <label :for="'choice_' + option" :key="option.id">{{option}}</label>
      </div>
      <input type="button" value="Vote" @click="submitVote">
    </form>
    <button
      v-if="isLoggedIn"
      class="twitter-button"
      title="Share via twitter"
      @click="shareViaTwitter"
    >
      <i class="fa fa-twitter fa-2x" aria-hidden="true"></i>
    </button>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import Piechart from './Piechart.vue';
import FetchPollByID from '../mixins/FetchPollByID.js';

export default {
  components: { Piechart },
  name: 'poll',
  mixins: [FetchPollByID],

  data: function() {
    return {
      picked: null,
      voted: false
    };
  },
  mounted: function() {
    this.fetchPoll();
    this.voted = this.isPollCompleted();
  },
  methods: {
    submitVote() {
      if (!this.picked) {
        return alert('Please choose option before submitting!');
      }
      axios({
        method: 'post',
        headers: {
          'Authorization': this.token || 'anonymous'
        },
        /* eslint-disable no-undef */
        url: API_URL + 'vote',
        data: {
          id: this.$route.params.id,
          option: this.picked
        }
      })
        .then(response => {
          const voteIndex = this.options.indexOf(response.data.option);
          this.votes.splice(voteIndex, 1, response.data.votes);
          this.saveVotedStatus();
        })
        .catch(err => {
          return alert('You can\'t vote now, sorry. Please, try again later: ' + err);
        });
    },
    saveVotedStatus() {
      if (!this.isPollCompleted()) {
        localStorage.setItem(this.$route.params.id, this.picked);
        this.voted = this.picked;
      }
    },
    isPollCompleted() {
      return localStorage.getItem(this.$route.params.id);
    },
    isVoteFirst() {
      return !this.votes.reduce((prev, next) => {
        return prev + next;
      }, 0);
    },
    shareViaTwitter() {
      const twitterShare = 'https://twitter.com/intent/tweet?text=';
      window.open(`${twitterShare}FCC vote: ${window.location.href}`, '_blank');
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    token() {
      return this.$store.getters.token;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "../stylus/theme"

.vote-status
  padding 1em
  font-weight bold
  background-color $banner-green-color
  color white

.choice-container
  margin-bottom 0.2em
  line-height 30px
  display flex
  overflow hidden

h2
  margin-top 1em

label
  cursor pointer
  position relative
  text-align center
  width 100%

input[type="radio"]
  display none

input[type="radio"] + label
  border 3px solid #efefef

input[type="radio"]:checked + label
  border 3px solid #2ecc71

input[type="button"]
button
  margin-top 1em
  text-transform uppercase
  background-color $banner-green-color
  color white
  width 100%

.twitter-button
  background-color #2E9AFE

.form-container
  padding 10px
  margin 0 auto
  max-width 400px

</style>
