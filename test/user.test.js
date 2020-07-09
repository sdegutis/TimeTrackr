const { User } = require('../server/user');

test('password verification', async () => {
  const user = new User();
  user.usePassword('foo');
  expect(user.checkPassword('foo')).toBeTruthy();
  expect(user.checkPassword('bar')).toBeFalsy();
});
