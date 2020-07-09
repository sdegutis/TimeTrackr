const mongoose = require('mongoose');

exports.whenReady = mongoose.connect('mongodb://localhost/timetrackr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
