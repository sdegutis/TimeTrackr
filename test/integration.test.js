require('dotenv').config();

const request = require('supertest');

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;
let mongoServer;

beforeEach(async () => {
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

afterEach(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

const { app } = require('../server/app');
const { User, AUTH } = require('../server/model/user');

test('creating accounts', async () => {
  const response = await request(app).post('/api/users').send({
    name: 'me',
    email: 'me@example.com',
    password: 'foo',
  });

  expect(response.body).toMatchObject({ ok: true });

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

test('listing users', async () => {
  await createUser('user@example.com', 'user');
  const token = await createUser('me@example.com', 'manager');

  const response = await request(app)
    .get('/api/manage/users')
    .set({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
    });

  expect(response.status).toBe(200);
  expect(response.body).toMatchObject({
    users: [
      { email: 'user@example.com', role: 'user', },
    ],
  });
});


// Helpers

async function createUser(email, role) {
  await request(app)
    .post('/api/users')
    .send({
      name: email,
      email: email,
      password: 'foo',
    })
    .set({ 'Content-Type': 'application/json' });

  const user = await User.findOne({ email });
  await user.setAuthLevel(role);
  await user.save();

  const resp = await request(app)
    .post('/api/users/auth')
    .send({
      email: email,
      password: 'foo',
    })
    .set({ 'Content-Type': 'application/json' });

  return resp.body.token;
}
