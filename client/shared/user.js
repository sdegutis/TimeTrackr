import { React } from '../util/deps.js';

/** @typedef {'admin' | 'manager' | 'user'} Role */

/**
 * @typedef User
 * @property {string} name
 * @property {string} email
 * @property {Role} role
 * @property {number} targetDailyHours
 */

export const UserContext = React.createContext({
  /** @type {User} */
  user: null,

  /** @param {User} user */
  setUser: (user) => { },
});
