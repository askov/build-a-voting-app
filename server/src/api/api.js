/* Do not store secret key this way in production */
const jwtsecret = 'mysecretkey1';

const api = require('koa-router')();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Poll = require('../models/poll');
const VoteAccounting = require('../models/voteAccounting');
const Vote = require('../models/vote');
const utils = require('../helpers/utils');


function createJWT(user) {
  const payload = {
    id: user.id,
    displayName: user.displayName,
    email: user.email
  };
  return jwt.sign(payload, jwtsecret);
}

async function getPolls(queryLimit) {
  return await Poll.find({}).sort({
    'updatedAt': -1
  }).limit(queryLimit || 0);
}

async function getPollById(id) {
  return await Poll.findOne({
    _id: id
  });
}

async function getVotesByPollId(id) {
  return await Vote.find({
    poll_id: id
  });
}

async function getPollsByAuthor(author) {
  return await Poll.find({
    author: author
  });
}

async function getUserByEmail(email) {
  return await User.findOne({
    email: email
  });
}

async function createNewPoll(poll) {
  try {
    const newPoll = new Poll(poll);
    await newPoll.save();
    return null;
  } catch (err) {
    return err;
  }
}

async function removePollRelatedEntries(pollId, author) {
  const poll = await Poll.findOneAndRemove({
    _id: pollId,
    author: author
  });
  if (!poll) {
    throw 'Sorry, poll id or authorship is incorrect.';
  }
  await Vote.remove({
    poll_id: pollId
  });
  await VoteAccounting.remove({
    poll_id: pollId
  });
}

async function removePollOptionRelatedEntries(pollId, oldOpts, newOpts) {
  const optsToRemove = oldOpts.filter(el => newOpts.indexOf(el) < 0);
  await Vote.remove({
    poll_id: pollId,
    option: {
      $in: optsToRemove
    }
  });
  await VoteAccounting.remove({
    poll_id: pollId,
    option: {
      $in: optsToRemove
    }
  });
}

function isUserAuthorized(header) {
  try {
    const token = header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtsecret);
    return decoded;
  } catch (err) {
    return !err;
  }
}

async function isUserVotedInPoll(request, userState) {
  let lastVotes;
  if (!userState) {
    const VOTE_TIMEOUT = 10 * 60 * 1000;

    lastVotes = await VoteAccounting.find({
      poll_id: request.body.id,
      user_ip: request.ip,
      user_agent: request.header['user-agent'],
      createdAt: {
        $gte: new Date(Date.now() - VOTE_TIMEOUT)
      }
    });
  } else {
    lastVotes = await VoteAccounting.find({
      poll_id: request.body.id,
      user_account: userState.email
    });
  }
  return Boolean(lastVotes.length);
}

async function addVoteAccountingRecord(request, userState) {
  const voteRecord = {
    poll_id: request.body.id,
    option: request.body.option,
    user_ip: request.ip,
    user_agent: request.header['user-agent'],
    user_account: userState ? userState.email : 'anonymous'
  };
  const voteToAccount = new VoteAccounting(voteRecord);
  await voteToAccount.save();
}

// ############################################################################
// #                                 GET                                      #
// ############################################################################
api.get('/recent-polls', async ctx => {
  try {
    const POLLS_LIMIT = 3;
    const polls = await getPolls(POLLS_LIMIT);
    ctx.body = utils.prepareListOfPolls(polls);
  } catch (err) {
    ctx.status = 500;
  }
});

api.get('/polls', async ctx => {
  const query = ctx.request.query;
  if (Object.keys(query).length) {
    if (utils.queryContainsCorrectId(query)) {
      try {
        const poll = await getPollById(query.id);
        const votes = await getVotesByPollId(query.id);
        const structVotes = utils.structurePollVotes(votes, poll.options);
        ctx.body = utils.structurePollData(poll, structVotes);
      } catch (err) {
        ctx.status = 500;
      }
    } else {
      ctx.status = 400;
    }
  } else {
    try {
      const polls = await getPolls();
      ctx.body = utils.prepareListOfPolls(polls);
    } catch (err) {
      ctx.status = 500;
    }
  }
});

api.get('/my-polls', async ctx => {
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtsecret);
    const polls = await getPollsByAuthor(decoded.email);
    ctx.body = utils.prepareListOfPolls(polls);
  } catch (err) {
    ctx.status = 401;
  }
});

// ############################################################################
// #                                POST                                      #
// ############################################################################
api.post('/user', async ctx => {
  if (!utils.validateRegistrationData(ctx.request.body)) {
    return ctx.status = 400;
  }
  try {
    await User.create(ctx.request.body);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 422;
  }
});

api.post('/login', async ctx => {
  const email = ctx.request.body.email;
  const password = ctx.request.body.password;
  const user = await getUserByEmail(email);

  if (user && user.checkPassword(password)) {
    ctx.body = {
      user: user.displayName,
      token: 'JWT ' + createJWT(user)
    };
  } else {
    ctx.status = 401;
  }
});

api.post('/create-poll', async ctx => {
  // We don't want to process this request if poll shape is incorrect
  if (!utils.validatePollObjectStructure(ctx.request.body)) {
    return ctx.status = 400;
  }
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtsecret);

    const newPoll = {
      title: ctx.request.body.title,
      options: ctx.request.body.options,
      author: decoded.email
    };

    const err = await createNewPoll(newPoll);
    if (err) throw 'Error creating poll.';
    ctx.status = 201;
  } catch (err) {
    ctx.status = 401;
  }
});

api.post('/remove-poll', async ctx => {
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtsecret);

    const pollId = ctx.request.body.id;
    await removePollRelatedEntries(pollId, decoded.email);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 401;
  }
});

api.post('/update-poll', async ctx => {
  // We don't want to process this request if poll shape is incorrect
  if (!utils.validatePollObjectStructure(ctx.request.body)) {
    return ctx.status = 400;
  }
  try {
    const token = ctx.request.header.authorization.split(' ')[1];
    const decoded = jwt.verify(token, jwtsecret);

    const pollId = ctx.request.body.id;
    const newOpts = ctx.request.body.options;

    const poll = await Poll.findOneAndUpdate({
      _id: ctx.request.body.id,
      author: decoded.email
    }, {
      $set: {
        title: ctx.request.body.title,
        options: newOpts
      }
    });
    await removePollOptionRelatedEntries(pollId, poll.options, newOpts);
    ctx.status = 200;
  } catch (err) {
    ctx.status = 401;
  }
});

api.post('/vote', async ctx => {
  try {
    const pollId = ctx.request.body.id;
    const pollOption = ctx.request.body.option;

    // If poll and related option doesn't exist, we want to break
    const poll = await Poll.findOne({
      _id: pollId,
      options: pollOption
    });
    if (!poll) throw 'Poll or option doesn\'t exist';

    const userState = isUserAuthorized(ctx.request.header);

    if (await isUserVotedInPoll(ctx.request, userState)) {
      return ctx.status = 403;
    }

    // Update vote counter
    const vote = await Vote.findOneAndUpdate({
      poll_id: pollId,
      option: pollOption
    }, {
      $inc: {
        votes: 1
      }
    }, {
      new: true,
      upsert: true
    });

    await addVoteAccountingRecord(ctx.request, userState);

    ctx.body = vote;
    ctx.status = 201;
  } catch (err) {
    ctx.status = 400;
  }
});

module.exports = api;
