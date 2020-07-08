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

test("basics", () => {
  expect(1 + 1).toBe(2);
});
