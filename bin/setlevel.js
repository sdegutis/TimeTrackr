#!/usr/bin/env node
const [, , email, role] = process.argv;
if (!email || !role || !['user', 'manager', 'admin'].includes(role))
  return console.log('Usage: promote.js <email> (user | manager | admin)');

const { User } = require("../server/user");
console.log(`Promoting ${email} to ${role}`);
require('../server/db').whenReady.then(() => {
  User.findOne({ email }).then((user) => {
    user.setAuthLevel(role);
    user.save().then(() => {
      console.log("Done.");
      process.exit(0);
    });
  });
});
