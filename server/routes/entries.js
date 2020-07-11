const { asyncHandler, requireAuthLevel } = require('../helpers');
const { User, AUTH } = require('../model/user');
const { Entry } = require('../model/entry');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.get('/entries/projects', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function (req) {
      const user = await User.findById(req.body._auth.id);
      if (!user) return [401, { error: 'Token invalid.' }];

      const projects = await Entry.distinct('project', { userId: user._id });
      return [200, { projects }];
    }),
  ]);

  app.post('/entries', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function (req) {
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

  app.get('/entries', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function (req) {
      // TODO: extract this common pattern of two lines
      const user = await User.findById(req.body._auth.id);
      if (!user) return [401, { error: 'Token invalid.' }];

      const entries = (await Entry.find({ userId: user._id })).map(entry => ({
        project: entry.project,
        date: entry.date,
        hours: entry.hours,
        notes: entry.notes,
        id: entry._id,
      }));
      return [200, { entries }];
    }),
  ]);

  app.delete('/entries/:id', [
    requireAuthLevel(AUTH.USER),
    asyncHandler(async function (req) {
      const user = await User.findById(req.body._auth.id);
      if (!user) return [401, { error: 'Token invalid.' }];

      const entry = await Entry.findById(req.params.id);
      if (!entry) return [404, { error: 'Invalid entry ID.' }];
      console.log(entry.userId);
      if (!entry.userId.equals(user._id)) return [403, { error: 'Invalid entry ID.' }];

      await entry.deleteOne();

      return [200, { ok: true }];
    }),
  ]);

};
