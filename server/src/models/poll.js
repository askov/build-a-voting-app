const mongoose = require('mongoose');

const pollSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  options: [
    {
      type: String,
      required: true,
      trim: true
    }
  ]
}, {
  timestamps: true
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
