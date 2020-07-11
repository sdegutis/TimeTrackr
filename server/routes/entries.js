const { asyncHandler, requireAuthLevel } = require('../helpers');
const { User, AUTH } = require('../model/user');
const { Entry } = require('../model/entry');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.post('/entries', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function getInfo(req) {
      const { project, hours, notes, date } = req.body;
      if (!project || !hours || !date)
        return [400, { error: "Required: project, hours, date" }];

      const user = await User.findById(req.body._auth.id);
      if (!user) return [401, { error: 'Token invalid.' }];

      const entry = new Entry({
        userId: user._id,
        project,
        hours,
        notes,
        date,
      });
      await entry.save();

      return [200, { ok: true }];
    }),
  ]);

};
