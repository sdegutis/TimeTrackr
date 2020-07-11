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

const Row = ({ entry, refresh }) => {
  return html`
    <tr>
      <td>${entry.date}</td>
      <td>${entry.project}</td>
      <td>${entry.hours}</td>
      <td>${entry.notes}</td>
    </tr>
  `;
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
                    <th class="uk-table-expand">Notes</th>
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
