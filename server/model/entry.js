const mongoose = require('mongoose');

/**
 * @typedef EntryClass
 * 
 * @property {import('mongoose').Types.ObjectId} userId
 * @property {string} project
 * @property {string} notes
 * @property {string} start
 * @property {number} duration
 */

const entrySchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  project: String,
  notes: String,
  start: String,
  duration: Number,
});

/** @type { import('mongoose').Model<import('mongoose').Document & EntryClass, {}> } */
const Entry = mongoose.model('Entry', entrySchema);

module.exports = { Entry };
