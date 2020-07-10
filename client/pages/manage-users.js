import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';
import { UserContext } from '../user.js';
import { pushPath } from '../util/router.js';
import { canManageUsers } from '../util/permissions.js';
import { NotAuthorized } from '../shared/unauthorized.js';
import { request } from '../util/request.js';

function notifyResult(ok) {
  if (ok) {
    UIkit.notification({
      message: 'Operation succeeded.',
      status: 'success',
      pos: 'bottom-left',
    });
  }
  else {
    UIkit.notification({
      message: 'Operation failed.',
      status: 'danger',
      pos: 'bottom-left',
    });
  }
}

const Edit = ({ email, initial, attr, refresh }) => {
  const [val, setVal] = React.useState(initial);
  const [editing, setEditing] = React.useState(false);

  React.useEffect(() => {
    setVal(initial);
  }, [initial]);

  const set = (e) => {
    if (e.keyCode === 27) {
      setEditing(false);
      setVal(initial);
    }
    else if (e.keyCode === 13 && val !== initial) {
      setEditing(false);
      e.target.blur();

      request('PATCH', `/api/manage/user/${email}`, { attr, val }).then(({ ok }) => {
        setVal(initial);
        refresh();
        notifyResult(ok);
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

const Delete = ({ email, refresh }) => {
  const run = (e) => {
    e.preventDefault();

    request('DELETE', `/api/manage/user/${email}`).then(({ ok }) => {
      refresh();
      notifyResult(ok);
    });
  };

  return html`
    <a href="" onClick=${run} uk-icon="icon: minus-circle"></a>
  `;
};

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  const { user } = React.useContext(UserContext);
  if (!user) return pushPath('/login');
  if (!canManageUsers(user.role)) return NotAuthorized;

  const [refresher, setRefresher] = React.useState(0);
  const refresh = () => setRefresher(r => r + 1);

  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    request('GET', '/api/manage/users').then((data) => {
      setUsers(data.users);
    });
  }, [refresher]);

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
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => html`
            <tr key=${user.email}>
              <td><${Edit} refresh=${refresh} email=${user.email} initial=${user.name} attr="name"/></td>
              <td><${Edit} refresh=${refresh} email=${user.email} initial=${user.email} attr="email"/></td>
              <td><${Edit} refresh=${refresh} email=${user.email} initial=${user.role} attr="role"/></td>
              <td><${Edit} refresh=${refresh} email=${user.email} initial=${user.targetDailyHours} attr="targetDailyHours"/></td>
              <td><${Delete} refresh=${refresh} email=${user.email} /></td>
            </tr>
          `)}
        </tbody>
      </table>

    </div >
  `;
});
