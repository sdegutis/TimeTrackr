const { User, AUTH } = require('../server/model/user');

test('password verification', async () => {
  const user = new User();
  user.usePassword('foo');
  expect(user.checkPassword('foo')).toBeTruthy();
  expect(user.checkPassword('bar')).toBeFalsy();
});

test('setting auth level', async () => {
  const user = new User();

  user.setAuthLevel('user');
  expect(user.authLevel).toBe(AUTH.USER);

  user.setAuthLevel('manager');
  expect(user.authLevel).toBe(AUTH.MANAGER);

  user.setAuthLevel('admin');
  expect(user.authLevel).toBe(AUTH.ADMIN);
});
