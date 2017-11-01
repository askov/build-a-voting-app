const mongoose = require('mongoose');

const voteAccountingSchema = mongoose.Schema({
  poll_id: {
    type: String,
    required: true
  },
  option: {
    type: String,
    required: true
  },
  user_ip: {
    type: String,
    required: true
  },
  user_agent: {
    type: String,
    required: true
  },
  user_account: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

const VoteAccounting = mongoose.model('VotedUsers', voteAccountingSchema);

module.exports = VoteAccounting;
