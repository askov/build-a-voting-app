const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
  poll_id: {
    type: String,
    required: true
  },
  option: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
});
  
const Vote = mongoose.model('Vote', voteSchema);

module.exports = Vote;