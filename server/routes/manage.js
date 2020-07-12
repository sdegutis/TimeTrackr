const { asyncHandler, requireAuthLevel, maybeDate } = require('../helpers');
const { User, AUTH } = require('../model/user');
const { Entry } = require('../model/entry');

/**
 * @param {import('express').Router} app
 */
module.exports = (app) => {

  app.get('/manage/users', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function (req) {
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
        return [400, { error: "Invalid attribute" }];

      if (attr === 'role' && !['admin', 'manager', 'user'].includes(val))
        return [400, { error: "Invalid role" }];

      const user = await User.findOne({ email });
      if (!user) return [404, { error: "User not found" }];

      if (myAuth === AUTH.MANAGER) {
        // Managers can't modify (or even see) managers/admins
        if (user.authLevel > AUTH.USER) return [403, { error: "Not enough permission" }];

        // Managers can't promote anyone to admin
        if (attr === 'role' && val === 'admin') return [403, { error: "Not enough permission" }];

        // Managers can't demote admins
        if (attr === 'role' && user.getRole() === 'admin') return [403, { error: "Not enough permission" }];
      }

      if (attr === 'targetDailyHours') {
        val = parseInt(val);
        if (isNaN(val)) return [400, { error: "Invalid target daily hours" }];
      }

      if (attr === 'role') {
        user.setAuthLevel(val);
      }
      else {
        user[attr] = val;
      }

      try {
        await user.save();
      }
      catch (e) {
        return [400, { error: e }];
      }

      return [200, { ok: true }];
    }),
  ]);

  app.delete('/manage/user/:email', [
    requireAuthLevel(AUTH.MANAGER),
    asyncHandler(async function (req) {
      const myAuth = req.body._auth.authLevel;
      const { email } = req.params;

      const user = await User.findOne({ email });
      if (!user) return [404, { error: "User not found." }];

      // Managers can't delete (or even see) managers/admins
      if (myAuth === AUTH.MANAGER) {
        if (user.authLevel > AUTH.USER) return [403, { error: "Not enough permission." }];
      }

      await user.deleteOne();

      return [200, { ok: true }];
    }),
  ]);

  app.get('/manage/entries', [
    requireAuthLevel(AUTH.ADMIN),
    asyncHandler(async function (req) {
      const rawEntries = await Entry.find().populate('userId');

      const entries = rawEntries.map(entry => ({
        project: entry.project,
        notes: entry.notes,
        hours: entry.hours,
        date: entry.date,
        id: entry._id,
        user: entry.userId.email,
      }));

      return [200, { entries }];
    }),
  ]);

  app.delete('/manage/entries/:id', [
    requireAuthLevel(AUTH.ADMIN),
    asyncHandler(async function (req) {
      const entry = await Entry.findById(req.params.id);
      if (!entry) return [404, { error: 'Invalid entry ID.' }];

      await entry.deleteOne();

      return [200, { ok: true }];
    }),
  ]);

  app.patch('/manage/entries/:id', [
    requireAuthLevel(AUTH.ADMIN),
    asyncHandler(async function (req) {
      const entry = await Entry.findById(req.params.id);
      if (!entry) return [404, { error: 'Invalid entry ID.' }];

      let { date, project, hours, notes } = req.body;

      date = maybeDate(date);
      if (date)
        entry.date = date;

      if (typeof project === 'string' && project.length > 0)
        entry.project = project;

      if (typeof notes === 'string' && notes.length > 0)
        entry.notes = notes;

      if (typeof hours === 'number' && !isNaN(hours) && hours > 0)
        entry.hours = hours;

      await entry.save();

      return [200, { ok: true }];
    }),
  ]);

};
