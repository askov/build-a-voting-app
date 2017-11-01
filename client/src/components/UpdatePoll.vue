<template>
<UpsertPoll
  v-bind="{
    pollTitle: title,
    pollOptions: options
  }"
/>
</template>

<script>
import UpsertPoll from './UpsertPoll';
import FetchPollByID from '../mixins/FetchPollByID.js';

export default {
  name: 'updatepoll',
  mixins: [FetchPollByID],
  components: {
    UpsertPoll
  },
  mounted: function() {
    this.fetchPoll();
  }
};
</script>

<style lang="stylus" scoped>

</style>
