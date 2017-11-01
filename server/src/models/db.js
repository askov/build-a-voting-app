const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/auth-app';

mongoose.Promise = Promise;
mongoose.set('debug', true);

const opts = {
  useMongoClient: true
};

mongoose.connect(dbURI, opts);

/* eslint-disable no-console */
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection opened at: ${dbURI}`);
});

mongoose.connection.on('error', error => {
  console.log(`Mongoose connection error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log(`Mongoose connection closed at: ${dbURI}`);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed due to app termination.');
    process.exit(0);
  });
});

module.exports = mongoose;
