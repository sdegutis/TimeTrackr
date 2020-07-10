const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const AUTH = {
  USER: 100,
  MANAGER: 200,
  ADMIN: 300,
};

/**
 * @typedef UserClass
 * 
 * @property {string} name
 * @property {string} email
 * @property {string} hash
 * @property {number} authLevel
 * @property {number} targetDailyHours
 * 
 * @property {typeof usePassword} usePassword
 * @property {typeof checkPassword} checkPassword
 * @property {typeof setAuthLevel} setAuthLevel
 * @property {typeof generateToken} generateToken
 */

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  hash: String,
  authLevel: Number,
  targetDailyHours: Number,
});

userSchema.method({
  setAuthLevel,
  usePassword,
  checkPassword,
  generateToken,
});

/**
 * @this {InstanceType<User>}
 * @param {'admin' | 'manager' | 'user'} role
 */
function setAuthLevel(role) {
  this.authLevel = {
    user: AUTH.USER,
    manager: AUTH.MANAGER,
    admin: AUTH.ADMIN,
  }[role];
}

/**
 * @this {InstanceType<User>}
 * @param {string} password
 */
function usePassword(password) {
  this.hash = bcrypt.hashSync(password, 10);
}

/**
 * @this {InstanceType<User>}
 * @param {string} password
 */
function checkPassword(password) {
  return bcrypt.compareSync(password, this.hash);
}

/**
 * @this {InstanceType<User>}
 */
function generateToken() {
  return jwt.sign({
    id: this._id,
    email: this.email,
    authLevel: this.authLevel,
    auth: {
      [AUTH.USER]: 'user',
      [AUTH.MANAGER]: 'manager',
      [AUTH.ADMIN]: 'admin',
    }[this.authLevel],
  }, process.env.JWT_SECRET);
}

/** @type { import('mongoose').Model<import('mongoose').Document & UserClass, {}> } */
const User = mongoose.model('Users', userSchema);

module.exports = { User, AUTH };
