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

};
