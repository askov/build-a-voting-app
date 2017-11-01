<template>
<div>
  <Loader />
  <ul>
    <li
      v-for="(poll, index) in polls"
      :key="poll.id"
      class="poll-item animated fadeInRight"
    >
      <div class="poll-header">
        <span
          class="vote-status"
          :class="{voted: isPollCompleted(poll.id)}"
        >
          {{isPollCompleted(poll.id) ? 'Voted' : 'Vote!'}}
        </span>
        <span
          title="Last time updated"
        >
          {{formatTime(poll)}}
        </span>
      </div>
      <router-link :to="'/polls/' + poll.id">
        <span>{{poll.title}}</span>
      </router-link>
    </li>
  </ul>
</div>
</template>

<script>
import axios from 'axios';
import Loader from './Loader';

export default {
  name: 'polls',
  props: ['fetchUrl'],
  components: {
    Loader
  },
  data: function() {
    return {
      polls: []
    };
  },
  mounted: function() {
    this.fetchPolls();
  },
  methods: {
    fetchPolls() {
      axios({
        method: 'get',
        /* eslint-disable no-undef */
        url: this.fetchUrl || (API_URL + 'polls')
      })
        .then(response => {
          this.polls = response.data;
        })
        .catch(err => {
          return alert('Polls are temporarily unavailable: ' + err);
        });
    },
    isPollCompleted(id) {
      return localStorage.getItem(id);
    },
    formatTime(poll) {
      return poll.updatedAt.slice(0, -5).replace('T', ' ');
    }
  }
};

</script>

<style lang="stylus" scoped>
@import "../stylus/polls"
</style>
