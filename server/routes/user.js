const { asyncHandler, requireAuthLevel } = require('../helpers');
const { User, AUTH } = require('../model/user');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.get('/users/info', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function getInfo(req) {
      const user = await User.findById(req.body._auth.id);
      const info = {
        name: user.name,
        email: user.email,
        targetDailyHours: user.targetDailyHours,
        role: {
          [AUTH.USER]: 'user',
          [AUTH.MANAGER]: 'manager',
          [AUTH.ADMIN]: 'admin',
        }[user.authLevel],
      };
      return [200, { info }];
    }),
  ]);

  app.post('/users/setinfo', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function logout(req, res) {
      const me = await User.findById(req.body._auth.id);

      me.name = req.body.name;
      me.targetDailyHours = req.body.targetDailyHours;
      await me.save();

      return [200, { ok: true }];
    }),
  ]);

  app.get('/users', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function listUsers(req) {
      const users = await User.find();
      return [200, { users }];
    }),
  ]);

};
