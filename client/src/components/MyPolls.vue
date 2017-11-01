<template>
  <div v-if="isLoggedIn">
    <div class="center-col-wrapper">
      <router-link to="/create-poll" class="create-poll">
        <i class="fa fa-plus-square-o" aria-hidden="true"></i>
        Create new poll
      </router-link>
    </div>
    <div v-if="pending">
      <Loader />
    </div>
    <div v-else>
      <ul v-if="polls.length">
        <transition-group
          enter-active-class="animated zoomIn"
          leave-active-class="animated lightSpeedOut"
        >
          <li
            v-for="(poll, index) in polls"
            :key="poll.id"
            class="poll-item"
          >
            <div class="poll-header">
              <span
                class="vote-status"
                :class="{voted: isPollCompleted(poll.id)}"
              >
                {{isPollCompleted(poll.id) ? 'Voted' : 'Vote!'}}
              </span>
              <router-link :to="'/update-poll/' + poll.id" class="edit-poll">
                <i class="fa fa-pencil" aria-hidden="true"></i>
                Edit
              </router-link>
              <button class="remove-poll" @click="removeMyPoll(index)">
                <i class="fa fa-times" aria-hidden="true"></i>
                Remove
              </button>
              <span title="Last time updated" class="updated-at">
                {{formatTime(poll)}}
              </span>
            </div>
            <router-link :to="'/polls/' + poll.id">
              <span>{{poll.title}}</span>
            </router-link>
          </li>
        </transition-group>
      </ul>
      <div v-else>
        <i class="fa fa-frown-o fa-5x" aria-hidden="true"></i>
        <h2>You have no polls yet</h2>
        <p>Create the new one now! Just click the green button on the top right corner
          of your workspace.
        </p>
      </div>
    </div>
  </div>
  <div v-else style="margin-top: 25vh; color: #333">
    <i class="fa fa-info-circle fa-5x" aria-hidden="true"></i>
    <h1>
      Please, log in to manage your polls.
    </h1>
  </div>
</template>

<script>
import axios from 'axios';
import Loader from './Loader';

export default {
  name: 'mypolls',
  components: {
    Loader
  },
  data: function() {
    return {
      polls: []
    };
  },
  mounted: function() {
    this.fetchMyPolls();
  },
  methods: {
    fetchMyPolls() {
      axios({
        method: 'get',
        headers: {
          'Authorization': this.token
        },
        /* eslint-disable no-undef */
        url: API_URL + 'my-polls'
      })
        .then(response => {
          this.polls = response.data;
        })
        .catch(err => {
          return alert('Your polls are temporarily unavailable: ' + err);
        });
    },
    removeMyPoll(index) {
      const pollID = this.polls[index].id;
      axios({
        method: 'post',
        headers: {
          'Authorization': this.token
        },
        url: API_URL + 'remove-poll',
        data: {
          id: pollID
        }
      })
        .then(response => {
          this.polls.splice(index, 1);
        })
        .catch(err => {
          return alert('Your polls are temporarily unavailable: ' + err);
        });
    },
    isPollCompleted(id) {
      return localStorage.getItem(id);
    },
    formatTime(poll) {
      return poll.updatedAt.slice(0, -5).replace('T', ' ');
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    token() {
      return this.$store.getters.token;
    },
    pending() {
      return this.$store.getters.pending;
    }
  }
};

</script>

<style lang="stylus" scoped>
@import "../stylus/theme"
@import "../stylus/polls"

.create-poll
  display inline-block
  background-color $banner-green-color
  height 20px
  line-height 20px
  color white
  font-weight bold

.remove-poll
  margin 0 10px
  color orangered

.edit-poll
  color #42d1f4

.center-col-wrapper
  width 80%
  max-width 800px
  margin 1em auto
  text-align right

@media screen and (max-width: 400px)
  .updated-at
    display none

</style>
