const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const user = require('./user');

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

user.setupRoutes(router);

module.exports = { app };
