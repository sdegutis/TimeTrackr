const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// MODEL

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  hash: String,
  authLevel: Number,
  targetDailyHours: Number,
});

const AUTH = {
  USER: 100,
  MANAGER: 200,
  ADMIN: 300,
};

userSchema.methods.usePassword = function (password) {
  this.hash = bcrypt.hashSync(password, 10);
};

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.hash);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({
    id: this._id,
    email: this.email,
    authLevel: this.authLevel,
  }, process.env.JWT_SECRET);
};

const User = mongoose.model('Users', userSchema);



// ROUTES

const jwt = require('jsonwebtoken');
const { asyncHandler } = require('./helpers');
const { requireAuthLevel } = require('./helpers');

/**
 * @param {import('express').Request} req
 */
async function createUser(req) {
  const { name, email, password } = req.body;

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

  return [200, { token: user.generateToken() }];
}

/**
 * @param {import('express').Request} req
 */
async function listUsers(req) {
  const me = await User.findById(req.auth.id);
  console.log({ me });

  const users = await User.find();
  return [200, users];
}

/**
 * @param {import('express').Request} req
 */
async function login(req) {
  const { email, password } = req.body;
  if (!email || !password) return [400, { "error": "Requires both 'email' and 'password'" }];

  const user = await User.findOne({ email });

  // Same result either way, to avoid email-sniffing
  if (!user) return [401, {}];
  if (!user.checkPassword(password)) return [401, {}];

  return [200, { token: user.generateToken() }];
}

/**
 * @param {import('express').Express} app
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

module.exports = { User, setupRoutes };
