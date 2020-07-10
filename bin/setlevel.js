#!/usr/bin/env node
const [, , email, role] = process.argv;
if (!email || !role || !['user', 'manager', 'admin'].includes(role)) {
  console.log('Usage: promote.js <email> (user | manager | admin)');
  process.exit(1);
}

const { User } = require("../server/model/user");
console.log(`Promoting ${email} to ${role}`);
require('../server/db').whenReady.then(() => {
  User.findOne({ email }).then((user) => {
    user.setAuthLevel(/** @type{*} */(role));
    user.save().then(() => {
      console.log("Done.");
      process.exit(0);
    });
  });
});
