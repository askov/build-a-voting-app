const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: String,
  salt: String,
}, {
  timestamps: true
});

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password.trim();
    if (password) {
      this.salt = crypto.randomBytes(128).toString('base64');
      this.passwordHash = createKey(this._plainPassword, this.salt);
    } else {
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  const keyRetrieved = createKey(password, this.salt);
  return keyRetrieved == this.passwordHash;
};

const User = mongoose.model('User', userSchema);


function createKey(password, salt) {
  const keylen = 128;
  const iterations = 100;
  const digest = 'sha512';
  return crypto.pbkdf2Sync(password, salt, iterations, keylen, digest);
}

module.exports = User;

