import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { UserContext } from '../../user.js';
import { pushPath } from '../../util/router.js';
import { canManageUsers } from '../../util/permissions.js';
import { NotAuthorized } from '../../shared/unauthorized.js';
import { request } from '../../util/request.js';
import { notifyResult } from '../../util/notify.js';

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

      request('PATCH', `/api/manage/user/${email}`, { attr, val }).then(({ ok, error }) => {
        setVal(initial);
        refresh();
        notifyResult(ok, error);
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

    if (!confirm(`Are you sure you want to delete user "${email}"?`)) return;

    request('DELETE', `/api/manage/user/${email}`).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);
    });
  };

  return html`
    <a href="" onClick=${run} uk-icon="icon: minus-circle"></a>
  `;
};

const CreateUser = ({ refresh }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const submit = (e) => {
    e.preventDefault();
    request('POST', '/api/users', { name, email, password }).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);

      if (ok) {
        UIkit.modal(document.getElementById('create-user-form')).hide();
      }
    });
  };

  return html`

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #create-user-form">
      Create User
    </button>

    <!-- This is the modal -->
    <div id="create-user-form" uk-modal="">
      <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close=""></button>
          <h2 class="uk-modal-title">Create User</h2>
          <form onSubmit=${submit}>
            <fieldset class="uk-fieldset">
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Name</label>
                <div class="uk-form-controls">
                  <input class="uk-input"
                    autoFocus=""
                    type="text"
                    value=${name}
                    onChange=${e => setName(e.target.value)}
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Email</label>
                <div class="uk-form-controls">
                  <input class="uk-input"
                    type="email"
                    value=${email}
                    onChange=${e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Password</label>
                <div class="uk-form-controls">
                  <input class="uk-input"
                    type="password"
                    value=${password}
                    onChange=${e => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Again</label>
                <div class="uk-form-controls">
                  <input class="uk-input"
                    type="password"
                    value=${password2}
                    onChange=${e => setPassword2(e.target.value)}
                  />
                </div>
              </div>
              <div class="uk-margin">
                <button
                  class="uk-button uk-button-primary"
                  onclick=${submit}
                  disabled=${password.length === 0 || password !== password2}
                >
                  Create User
                </button>
              </div>
            </fieldset>
          </form>
        </div>
    </div>
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

      <${CreateUser} refresh=${refresh} />

      <hr/>
      
      <h3>User Listing</h3>
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
          ${users.length === 0 && html`
            <tr>
              <td colspan="5">
                <em>No entries.</em>
              </td>
            </tr>
          `}
          ${users.map(u => html`
            <tr key=${u.email}>
              <td><${Edit} refresh=${refresh} email=${u.email} initial=${u.name} attr="name"/></td>
              <td><${Edit} refresh=${refresh} email=${u.email} initial=${u.email} attr="email"/></td>
              <td><${Edit} refresh=${refresh} email=${u.email} initial=${u.role} attr="role"/></td>
              <td><${Edit} refresh=${refresh} email=${u.email} initial=${u.targetDailyHours} attr="targetDailyHours"/></td>
              <td><${Delete} refresh=${refresh} email=${u.email} /></td>
            </tr>
          `)}
        </tbody>
      </table>

    </div >
  `;
});
