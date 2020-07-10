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

const Edit = ({ user, attr }) => {
  const [val, setVal] = React.useState(user[attr]);
  const [editing, setEditing] = React.useState(false);

  const set = (e) => {
    if (e.keyCode === 27) {
      setEditing(false);
      setVal(user[attr]);
    }
    else if (e.keyCode === 13 && val !== user[attr]) {
      setEditing(false);
      e.target.blur();

      request('PATCH', `/api/manage/user/${user.email}`, { attr, val }).then(({ ok }) => {
        console.log('ok', ok);
      });
    }
  };

  return html`
    <div class="uk-inline">
      <input class="uk-input"
        type="text"
        value=${val}
        onKeyDown=${set}
        readOnly=${!editing}
        onDoubleClick=${() => setEditing(true)}
        onChange=${e => setVal(e.target.value)}
      />
    </div>
  `;
};

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

      <p>Double click an entry to edit it. Press enter to commit. Press escape to cancel.</p>

      <table class="uk-table uk-table-divider">
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
              <td><${Edit} user=${user} attr="name"/></td>
              <td><${Edit} user=${user} attr="email"/></td>
              <td><${Edit} user=${user} attr="role"/></td>
              <td><${Edit} user=${user} attr="targetDailyHours"/></td>
            </tr>
          `)}
        </tbody>
      </table>

    </div >
  `;
});
