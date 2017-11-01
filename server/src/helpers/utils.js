module.exports = {
  prepareListOfPolls: function(polls) {
    return polls.map(el => {
      return {
        id: el.id,
        updatedAt: el.updatedAt,
        title: el.title
      };
    });
  },
  structurePollVotes: function (pollVotes, pollOptions) {
    const votesObj = Object.assign({}, ...pollVotes.map(el => {
      let tmp = {};
      tmp[el.option] = el.votes;
      return tmp;
    }));

    const votesArr = pollOptions.map(el => {
      return el in votesObj ? votesObj[el] : 0;
    });

    return votesArr;
  },
  structurePollData: function(poll, votes) {
    return {
      id: poll.id,
      title: poll.title,
      options: poll.options,
      votes: votes
    };
  },
  validatePollObjectStructure: function(polldata) {
    const OPTIONS_MIN = 2;
    const OPTIONS_MAX = 10;
    const TITLE_LENGTH_MIN = 3;
    const TITLE_LENGTH_MAX = 100;
    const OPTION_LENGTH_MAX = 30;

    // Basic object structure check
    if (typeof polldata !== 'object' || polldata === null) {
      return false;
    }
    // Object keys check
    const pollKeysCreate = '["options","title"]';
    const pollKeysUpdate = '["id","options","title"]';
    const pollKeysProvided = JSON.stringify(Object.keys(polldata).sort());

    if (pollKeysProvided !== pollKeysCreate &&
      pollKeysProvided !== pollKeysUpdate) {
      return false;
    }
    if (pollKeysProvided === pollKeysUpdate) {
      if (!this.queryContainsCorrectId({id: polldata.id})) {
        return false;
      }
    }
    // Title check
    if (typeof polldata.title !== 'string' ||
      !isLengthLimited(polldata.title, TITLE_LENGTH_MIN, TITLE_LENGTH_MAX)) {
      return false;
    }
    // Options check
    if (!Array.isArray(polldata.options)) {
      return false;
    }
    if (polldata.options.length < OPTIONS_MIN ||
      polldata.options.length > OPTIONS_MAX) {
      return false;
    }
    if (polldata.options.filter(el => {
      return (typeof el !== 'string') || !isLengthLimited(el, 1, OPTION_LENGTH_MAX);
    }).length) {
      return false;
    }
    if (doesContainDuplicates(polldata.options)) {
      return false;
    }
    return true;
  },
  validateRegistrationData: function(data) {
    const name = data.displayName.trim();
    const password = data.password.trim();
    const email = data.email.trim();

    if (name.length < 3 || name.length > 20) {
      return false;
    }
    if (password.length < 6 || password.length > 32) {
      return false;
    }
    if (stringContainsWhiteSpace(password)) {
      return false;
    }
    if (email.length < 8 || email.length > 32) {
      return false;
    }
    if (stringContainsWhiteSpace(email)) {
      return false;
    }
    return true;
  },
  queryContainsCorrectId: function(query) {
    return /^{"id":"[0-9abcdef]{24}"}$/g.test(JSON.stringify(query));
  }
};

function isLengthLimited(str, minlen, maxlen) {
  return str.length <= maxlen && str.length >= minlen;
}

function stringContainsWhiteSpace(str) {
  return /\s/g.test(str);
}

function doesContainDuplicates(arr) {
  const filtered = arr.filter((el, pos) => {
    return arr.indexOf(el) == pos;
  });
  return !(filtered.length == arr.length);
}
