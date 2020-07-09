require('dotenv').config();

const port = process.env.NODE_PORT;

const { app } = require('./app');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/timetrackr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  app.listen(port, function () {
    console.log('Listening on %s', port);
  });
});
