import { React } from './util/deps.js';

/**
 * @typedef User
 * @property {string} name
 * @property {string} email
 * @property {string} role
 * @property {number} targetDailyHours
 */

export const UserContext = React.createContext({
  /** @type {User} */
  user: null,

  /** @param {User} user */
  setUser: (user) => { },
});
