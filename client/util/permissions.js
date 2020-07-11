/** @param {import("../shared/user").Role} role */
export const canManageUsers = (role) =>
  role === 'admin' || role === 'manager';

/** @param {import("../shared/user").Role} role */
export const canManageEntries = (role) =>
  role === 'admin';
