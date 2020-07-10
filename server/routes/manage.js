const { asyncHandler, requireAuthLevel } = require('../helpers');
const { User, AUTH } = require('../model/user');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.get('/manage/users', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function listUsers(req) {
      const myAuth = req.body._auth.authLevel;
      const users = (await User.find()).filter(user => {
        if (myAuth === AUTH.ADMIN) return true;
        return user.authLevel === AUTH.USER;
      }).map(user => ({
        name: user.name,
        email: user.email,
        targetDailyHours: user.targetDailyHours,
        role: user.getRole(),
      }));
      return [200, { users }];
    }),
  ]);

  app.patch('/manage/user/:email', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function (req) {
      const myAuth = req.body._auth.authLevel;
      const { email } = req.params;
      let { attr, val } = req.body;

      if (!['name', 'email', 'targetDailyHours', 'role'].includes(attr))
        return [400, {}];

      if (attr === 'role' && !['admin', 'manager', 'user'].includes(val))
        return [400, {}];

      const user = await User.findOne({ email });
      if (!user) return [404, {}];

      if (myAuth === AUTH.MANAGER) {
        // Managers can't modify (or even see) managers/admins
        if (user.authLevel > AUTH.USER) return [403, {}];

        // Managers can't promote anyone to admin
        if (attr === 'role' && val === 'admin') return [403, {}];

        // Managers can't demote admins
        if (attr === 'role' && user.getRole() === 'admin') return [403, {}];
      }

      if (attr === 'targetDailyHours') {
        val = parseInt(val);
        if (isNaN(val)) return [400, {}];
      }

      if (attr === 'role') {
        user.setAuthLevel(val);
      }
      else {
        user[attr] = val;
      }

      await user.save();

      return [200, { ok: true }];
    }),
  ]);

  app.delete('/manage/user/:email', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function (req) {
      const myAuth = req.body._auth.authLevel;
      const { email } = req.params;

      const user = await User.findOne({ email });
      if (!user) return [404, {}];

      // Managers can't delete (or even see) managers/admins
      if (myAuth === AUTH.MANAGER) {
        if (user.authLevel > AUTH.USER) return [403, {}];
      }

      await user.deleteOne();

      return [200, { ok: true }];
    }),
  ]);

};
