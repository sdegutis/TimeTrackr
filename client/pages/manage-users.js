import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';
import { UserContext } from '../user.js';
import { pushPath } from '../util/router.js';
import { canManageUsers } from '../util/permissions.js';
import { NotAuthorized } from '../shared/unauthorized.js';

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  const { user } = React.useContext(UserContext);
  if (!user) return pushPath('/login');
  if (!canManageUsers(user.role)) return NotAuthorized;

  return html`
    <${Header}/>

    <div class="uk-container">
      ok
    </div>
  `;
});
