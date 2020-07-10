import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';
import { UserContext } from '../user.js';
import { pushPath } from '../util/router.js';
import { canManageUsers } from '../util/permissions.js';
import { NotAuthorized } from '../shared/unauthorized.js';
import { request } from '../util/request.js';

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  const { user } = React.useContext(UserContext);
  if (!user) return pushPath('/login');
  if (!canManageUsers(user.role)) return NotAuthorized;

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    request('GET', '/api/manage/users').then((data) => {
      setUsers(data.users);
    });
  }, []);

  return html`
    <${Header}/>

    <div class="uk-container">

      <table class="uk-table">
        <caption>Users</caption>
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Target Daily Hours</th>
            </tr>
        </thead>
        <tbody>
          ${users.map(user => html`
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.targetDailyHours}</td>
            </tr>
          `)}
        </tbody>
      </table>

    </div>
  `;
});
