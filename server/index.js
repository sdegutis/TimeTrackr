require('dotenv').config();
const { app } = require('./app');
const db = require('./db');

const port = process.env.NODE_PORT;

db.whenReady.then(() => {
  app.listen(port, function () {
    console.log('Listening on %s', port);
  });
});
