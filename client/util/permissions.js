/** @param {import("../user").Role} role */
export const canManageUsers = (role) =>
  role === 'admin' || role === 'manager';
