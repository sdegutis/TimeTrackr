const mongoose = require('mongoose');

/**
 * @typedef EntryClass
 * 
 * @property {InstanceType<import('./user')['User']>} userId
 * @property {string} project
 * @property {string} notes
 * @property {string} date
 * @property {number} hours
 */

const entrySchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  project: { type: String, required: true },
  notes: { type: String, required: true },
  date: { type: String, required: true },
  hours: { type: Number, required: true },
});

/** @type { import('mongoose').Model<import('mongoose').Document & EntryClass, {}> } */
const Entry = mongoose.model('Entry', entrySchema);

module.exports = { Entry };
