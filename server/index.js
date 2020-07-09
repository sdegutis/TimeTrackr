require('dotenv').config();
require('./db').whenReady.then(() => {
  const port = process.env.NODE_PORT;
  const { app } = require('./app');
  app.listen(port, function () {
    console.log('Listening on %s', port);
  });
});
