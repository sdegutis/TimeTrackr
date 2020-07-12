const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

exports.whenReady = mongoose.connect('mongodb://localhost/timetrackr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
