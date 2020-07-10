const { asyncHandler, requireAuthLevel } = require('../helpers');
const { User, AUTH } = require('../model/user');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.get('/manage/users', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function listUsers(req) {
      const users = (await User.find()).map(user => ({
        name: user.name,
        email: user.email,
        targetDailyHours: user.targetDailyHours,
        role: user.getRole(),
      }));
      return [200, { users }];
    }),
  ]);

};
