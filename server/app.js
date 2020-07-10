const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

if (process.env.NODE_ENV === 'development') {
  console.log('Also running file server for convenience.');
  app.use(express.static(path.join(__dirname, '../client')));
}

const router = express.Router();

router.use(bodyParser.json({
  type: [
    'application/x-www-form-urlencoded', // for convenience with cURL
    'application/json',
  ]
}));

app.use(cookieParser());
app.use('/api', router);

require('./routes/auth')(router);
require('./routes/account')(router);

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

module.exports = { app };
