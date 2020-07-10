const { asyncHandler, requireAuthLevel } = require('../helpers');
const { User, AUTH } = require('../model/user');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.post('/users', [
    asyncHandler(async function createUser(req, res) {
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

      const token = user.generateToken();
      res.cookie('jwt', token, { httpOnly: true, secure: true });
      return [200, { token }];
    }),
  ]);

  app.post('/users/auth', [
    asyncHandler(async function login(req, res) {
      const { email, password } = req.body;
      if (!email || !password)
        return [400, { error: "Required: email, password" }];

      const user = await User.findOne({ email });

      // Same result either way, to avoid email-sniffing
      if (!user) return [401, {}];
      if (!user.checkPassword(password)) return [401, {}];

      const token = user.generateToken();
      res.cookie('jwt', token, { httpOnly: true, secure: true });
      return [200, { token }];
    }),
  ]);

  app.get('/users', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function listUsers(req) {
      const me = await User.findById(req.body._auth.id);
      console.log({ me });

      const users = await User.find();
      return [200, { users }];
    }),
  ]);

  app.get('/users/info', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function getInfo(req) {
      const info = await User.findById(req.body._auth.id);
      return [200, { info }];
    }),
  ]);

  app.post('/users/deauth', [
    asyncHandler(async function logout(req, res) {
      res.clearCookie('jwt');
      return [200, { ok: true }];
    }),
  ]);

};