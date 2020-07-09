const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MODEL

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

const userSchema = new Schema({
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



// ROUTES

const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./helpers');
const { requireAuthLevel } = require('./helpers');

/**
 * @type {import('./helpers').AsyncHandler}
 */
async function createUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return [400, { error: "Required: name, email, password" }];

  const found = await User.findOne({ email });
  if (found) return [409, {}];

  const authLevel = AUTH.USER;

  const user = new User({
    name,
    email,
    authLevel,
    targetDailyHours: 8,
  });

  user.usePassword(password);
  await user.save();

  return signInAsUser(res, user);
}

/**
 * @param {import('express').Response} res
 * @param {InstanceType<User>} user
 * @returns {[number, object]}
 */
function signInAsUser(res, user) {
  const token = user.generateToken();

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
  });

  return [200, { token }];
}

/**
 * @type {import('./helpers').AsyncHandler}
 */
async function listUsers(req) {
  const me = await User.findById(req.body._auth.id);
  console.log({ me });

  const users = await User.find();
  return [200, { users }];
}

/**
 * @type {import('./helpers').AsyncHandler}
 */
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return [400, { error: "Required: email, password" }];

  const user = await User.findOne({ email });

  // Same result either way, to avoid email-sniffing
  if (!user) return [401, {}];
  if (!user.checkPassword(password)) return [401, {}];

  return signInAsUser(res, user);
}

/**
 * @param {import('express').Router} app
 */
function setupRoutes(app) {

  app.post('/users', [
    asyncHandler(createUser),
  ]);

  app.post('/users/auth', [
    asyncHandler(login),
  ]);

  app.get('/users', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(listUsers),
  ]);

}

module.exports = { User, setupRoutes, AUTH };
