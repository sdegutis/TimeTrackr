import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { UserContext } from '../../shared/user.js';
import { pushPath } from '../../util/router.js';
import { canManageEntries } from '../../util/permissions.js';
import { NotAuthorized } from '../../shared/unauthorized.js';
import { request } from '../../util/request.js';
import { notifyResult } from '../../util/notify.js';

/**
 * @typedef Props
 * @property {object} params
 */

// TODO: Consolidate all these admin forms
//       into reusable React components
//       with a consistent UI and API.
const Delete = ({ id, refresh }) => {
  const run = (e) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to delete this log entry?`)) return;

    request('DELETE', `/api/manage/entries/${id}`).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);
    });
  };

  return html`<a href="" onClick=${run} uk-icon="icon: minus-circle"></a>`;
};

const Row = ({ entry, refresh }) => {
  const [editing, setEditing] = React.useState(false);
  const [newValues, setNewValues] = React.useState({ ...entry });

  const edit = (e) => {
    e.preventDefault();
    setEditing(true);
  };

  const submit = (e) => {
    e.preventDefault();
    setEditing(false);
    request('PATCH', `/api/manage/entries/${entry.id}`, {
      date: newValues.date,
      project: newValues.project,
      hours: parseFloat(newValues.hours),
      notes: newValues.notes,
    }).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);
    });
  };

  const cancel = (e) => {
    e.preventDefault();
    setEditing(false);
    setNewValues(entry);
  };

  const update = (val, attr) => {
    setNewValues(vals => ({ ...vals, [attr]: val }));
  };

  const validFormData = (editing &&
    newValues.project.length > 0 &&
    newValues.date.match(/^\d{4}-\d{2}-\d{2}$/) &&
    !isNaN(parseFloat(newValues.hours))
  );

  if (!editing) {
    return html`
      <tr>
        <td>${entry.date}</td>
        <td>${entry.project}</td>
        <td>${entry.hours}</td>
        <td>${entry.notes}</td>
        <td>
          <ul class="uk-iconnav">
            <li><a href="" onClick=${edit} uk-icon="icon: pencil"></a></li>
            <li><${Delete} refresh=${refresh} id=${entry.id} /></li>
          </ul>
        </td>
      </tr>
    `;
  }
  else {
    return html`
      <tr>
        <td><input class="uk-input" type="text" value=${newValues.date}    onChange=${e => update(e.target.value, 'date')} /></td>
        <td><input class="uk-input" type="text" value=${newValues.project} onChange=${e => update(e.target.value, 'project')} /></td>
        <td><input class="uk-input" type="text" value=${newValues.hours}   onChange=${e => update(e.target.value, 'hours')} /></td>
        <td><input class="uk-input" type="text" value=${newValues.notes}   onChange=${e => update(e.target.value, 'notes')} /></td>
        <td>
              <button disabled=${!validFormData} onClick=${submit} class="uk-button uk-button-default uk-button-small">
                <span uk-icon="icon: check"></span>
              </button>
              <button onClick=${cancel} class="uk-button uk-button-default uk-button-small">
                <span uk-icon="icon: close"></span>
              </button>
        </td>
      </tr>
    `;
  }
};

export default /** @type {React.FC<Props>} */((props) => {
  const { user } = React.useContext(UserContext);
  if (!user) return pushPath('/login');
  if (!canManageEntries(user.role)) return NotAuthorized;

  const [refresher, setRefresher] = React.useState(0);
  const refresh = () => setRefresher(r => r + 1);

  const [entries, setEntries] = React.useState([]);

  React.useEffect(() => {
    request('GET', '/api/manage/entries').then((data) => {
      const groups = _.groupBy(data.entries, 'user');
      const list = Object.entries(groups).map(([user, entries]) => {
        return { user, entries };
      });
      setEntries(list);
    });
  }, [refresher]);

  return html`
    <${Header}/>

    <div class="uk-container">
      <h3>Entry Listing</h3>
      ${entries.map(({ user, entries }) => html`
        <ul uk-accordion="">
          <li>
            <a class="uk-accordion-title" href="#">${user}</a>
            <div class="uk-accordion-content">
              <table class="uk-table uk-table-divider">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th class="uk-table-shrink">Hours</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${entries.map(entry => html`
                    <${Row} entry=${entry} refresh=${refresh}/>
                  `)}
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      `)}
    </div>
  `;
});
