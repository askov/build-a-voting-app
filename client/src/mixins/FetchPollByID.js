import axios from 'axios';

export default {
  data: function() {
    return {
      title: '',
      options: [''],
      votes: []
    };
  },
  methods: {
    fetchPoll() {
      axios({
        method: 'get',
        /* eslint-disable no-undef */
        url: API_URL + `polls?id=${this.$route.params.id}`
      })
        .then(response => {
          this.votes = response.data.votes;
          this.options = response.data.options;
          this.title = response.data.title;
        })
        /* eslint-disable handle-callback-err */
        .catch(err => {
          this.$router.push('/page-not-found');
        });
        /* eslint-enable */
    }
  }
};

