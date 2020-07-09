require('dotenv').config();

const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
let mongoServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  const opts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(mongoUri, opts, (err) => {
    if (err) console.error(err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const { app } = require('../server/app');
const { User, AUTH } = require('../server/user');

test('creating accounts', async () => {
  const response = await request(app).post('/api/users').send({
    name: 'me',
    email: 'me@example.com',
    password: 'foo',
  });

  expect(response.body).toMatchObject({
    token: /.+/,
  });

  const users = await User.find();
  expect(users).toMatchObject([
    {
      email: 'me@example.com',
      name: 'me',
      hash: /.+/,
      authLevel: AUTH.USER,
    },
  ]);
});

test('account must be unique by email', async () => {
  await request(app).post('/api/users').send({
    name: 'me',
    email: 'me@example.com',
    password: 'foo',
  });

  const response = await request(app).post('/api/users').send({
    name: 'me',
    email: 'me@example.com',
    password: 'foo',
  });

  expect(response.status).toBe(409);

  const count = await User.countDocuments();
  expect(count).toBe(1);
});
