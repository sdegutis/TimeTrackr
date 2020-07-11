const mongoose = require('mongoose');

/**
 * @typedef EntryClass
 * 
 * @property {string} userId
 * @property {string} project
 * @property {string} notes
 * @property {string} start
 * @property {number} duration
 */

const entrySchema = new mongoose.Schema({
  userId: String,
  project: String,
  notes: String,
  start: String,
  duration: Number,
});

/** @type { import('mongoose').Model<import('mongoose').Document & EntryClass, {}> } */
const Entry = mongoose.model('Entrys', entrySchema);

module.exports = { Entry };
