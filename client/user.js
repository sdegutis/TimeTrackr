import { React } from './util/deps.js';

/**
 * @typedef User
 * @property {string} name
 * @property {string} email
 * @property {string} role
 */

export const UserContext = React.createContext({
  /** @type {User} */
  user: null,

  /** @param {User} user */
  setUser: (user) => { },
});
