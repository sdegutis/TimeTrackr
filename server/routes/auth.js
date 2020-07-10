const { asyncHandler, allowToken } = require('../helpers');
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

      return [201, { ok: true }];
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
      allowToken(token);
      const secure = process.env.NODE_ENV !== 'development';
      res.cookie('jwt', token, { httpOnly: true, secure });
      return [200, { token }];
    }),
  ]);

  app.post('/users/deauth', [
    asyncHandler(async function logout(req, res) {
      res.clearCookie('jwt');
      return [200, { ok: true }];
    }),
  ]);

};
