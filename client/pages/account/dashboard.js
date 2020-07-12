import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { UserContext } from '../../shared/user.js';
import { pushPath } from '../../util/router.js';
import { request } from '../../util/request.js';
import { notifyResult } from '../../util/notify.js';

const today = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  ]
    .map(n => n
      .toFixed()
      .padStart(2, '0'))
    .join('-');
};

const AddEntry = ({ refresh }) => {
  const [potentialProjects, setPotentialProjects] = React.useState([]);

  const [project, setProject] = React.useState('');
  const [date, setDate] = React.useState(today());
  const [hours, setHours] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    request('GET', '/api/entries/projects').then((data) => {
      setPotentialProjects(data.projects);
    });
  }, []);

  const submit = (e) => {
    e.preventDefault();
    request('POST', '/api/entries', {
      project,
      date,
      hours: parseFloat(hours),
      notes,
    }).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);

      if (ok) {
        UIkit.modal(document.getElementById('add-entry-form')).hide();
        setProject('');
        setDate(today());
        setHours('');
        setNotes('');
      }
    });
  };

  const validForm = (
    !isNaN(parseFloat(hours)) &&
    project.length > 0 &&
    date.match(/\d{4}-\d{2}-\d{2}/)
  );

  const choose = (proj) => (e) => {
    e.preventDefault();
    setProject(proj);
    /**@type{*}*/(UIkit.dropdown(document.getElementById('choose-project-dropdown'))).hide(false);
  };

  return html`

    <button class="uk-button uk-button-default uk-margin-small-right" type="button" uk-toggle="target: #add-entry-form">
      Add Entry
    </button>

    <!-- This is the modal -->
    <div id="add-entry-form" uk-modal="">
      <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close=""></button>
          <h2 class="uk-modal-title">Add Entry</h2>
          <form onSubmit=${submit}>
            <fieldset class="uk-fieldset">
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Project</label>
                <div class="uk-form-controls">
                    <input class="uk-input"
                      required=true
                      autoFocus=true
                      type="text"
                      value=${project}
                      onChange=${e => setProject(e.target.value)}
                    />
                    ${potentialProjects.length > 0 && html`
                      <div id="choose-project-dropdown" uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                          <ul class="uk-nav uk-dropdown-nav">
                            ${potentialProjects.map(proj => html`
                              <li><a onClick=${choose(proj)} href="">${proj}</a></li>
                            `)}
                          </ul>
                      </div>
                    `}
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Date</label>
                <div class="uk-form-controls">
                  <input class="uk-input"
                    required=true
                    type="text"
                    value=${date}
                    onChange=${e => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Hours</label>
                <div class="uk-form-controls">
                  <input class="uk-input"
                    required=true
                    type="text"
                    value=${hours}
                    onChange=${e => setHours(e.target.value)}
                  />
                </div>
              </div>
              <div class="uk-margin">
                <label class="uk-form-label" for="form-stacked-text">Notes</label>
                <div class="uk-form-controls">
                  <textarea class="uk-textarea"
                    type="text"
                    value=${notes}
                    onChange=${e => setNotes(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div class="uk-margin">
                <button
                  class="uk-button uk-button-primary"
                  onclick=${submit}
                  disabled=${!validForm}
                >
                  Add Entry
                </button>
              </div>
            </fieldset>
          </form>
        </div>
    </div>
  `;
};

const PassMark = html`<span uk-icon="icon: check; ratio: 2" style=${{ color: 'green' }}></span>`;
const FailMark = html`<span uk-icon="icon: close; ratio: 2" style=${{ color: 'crimson' }}></span>`;

const Delete = ({ id, refresh }) => {
  const run = (e) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to delete this log entry?`)) return;

    request('DELETE', `/api/entries/${id}`).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);
    });
  };

  return html`
    <a href="" onClick=${run} uk-icon="icon: minus-circle"></a>
  `;
};

const Row = ({ refresh, entry }) => {
  const [editing, setEditing] = React.useState(false);
  const [newValues, setNewValues] = React.useState({ ...entry });

  const edit = (e) => {
    e.preventDefault();
    setEditing(true);
  };

  const cancel = (e) => {
    e.preventDefault();
    setEditing(false);
    setNewValues(entry);
  };

  const submit = (e) => {
    e.preventDefault();
    setEditing(false);

    request('PATCH', `/api/entries/${entry.id}`, {
      project: newValues.project,
      hours: parseFloat(newValues.hours),
      notes: newValues.notes,
    }).then(({ ok, error }) => {
      refresh();
      notifyResult(ok, error);
    });
  };

  const updateVal = (attr, val) => {
    setNewValues(vals => ({ ...vals, [attr]: val }));
  }

  const field = (attr) => html`
    <input class="uk-input"
      value=${newValues[attr]}
      onChange=${e => updateVal(attr, e.target.value)}
    />
  `;

  const validFormData = editing && (
    !isNaN(parseFloat(newValues.hours)) &&
    newValues.project.length > 0
  );

  return html`
    <tr>
      <td>${editing ? field('hours') : entry.hours}</td>
      <td>${editing ? field('project') : entry.project}</td>
      <td>${editing ? field('notes') : entry.notes}</td>
      <td>
        <ul class="uk-iconnav">
          ${editing ? html`
              <li>
                <button disabled=${!validFormData} onClick=${submit} class="uk-button uk-button-default">
                  <span uk-icon="icon: check"></span>
                </button>
              </li>
              <li>
                <button onClick=${cancel} class="uk-button uk-button-default">
                  <span uk-icon="icon: close"></span>
                </button>
              </li>
            ` : html`
              <li><a href="" onClick=${edit} uk-icon="icon: pencil"></a></li>
              <li><${Delete} refresh=${refresh} id=${entry.id} /></li>
            `}
        </ul>
      </td>
    </tr>
  `;
};

const ListEntries = ({ refreshes, refresh }) => {
  const { user } = React.useContext(UserContext);
  const [entries, setEntries] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  React.useEffect(() => {
    request('GET', `/api/entries?from=${fromDate}&to=${toDate}`).then(({ entries, total }) => {
      setTotal(total);

      const sorted = _.sortBy(entries, 'date').reverse();
      const grouped = _.groupBy(sorted, 'date');
      const list = Object.entries(grouped).map(([date, entries]) => {
        const did = entries.map(e => e.hours).reduce((a, b) => a + b, 0);
        const good = did >= user.targetDailyHours;
        return { date, entries, did, good };
      });
      setEntries(list);
    });
  }, [refreshes]);

  React.useEffect(() => {
    if ((fromDate.trim() === '' || fromDate.match(/^\d{4}-\d{2}-\d{2}$/)) &&
      (toDate.trim() === '' || toDate.match(/^\d{4}-\d{2}-\d{2}$/))) {
      refresh();
    }
  }, [fromDate, toDate]);

  if (total === 0) return html`
    <em>No entries yet. Add one above.</em>
  `;

  const dates = entries.map(({ date }) => date);
  const toDates = [...dates];
  const fromDates = [...dates].reverse();

  const chooseDate = (date, set) => e => {
    e.preventDefault();
    set(date);
    for (const el of document.getElementsByClassName('date-dropdown')) {
      /**@type{*}*/(UIkit.dropdown(el).hide)(false);
    }
  };

  const exportAsHTML = (e) => {
    e.preventDefault();
    const win = window.open();

    const contentEl = document.getElementById('exportable-area');
    const hidable = [
      ...contentEl.getElementsByTagName('button'),
      ...contentEl.getElementsByTagName('a'),
    ];

    hidable.forEach(el => el.hidden = true);

    win.document.write(document.getElementsByTagName('head')[0].innerHTML);
    win.document.write(`<body><div class="uk-container uk-margin-top">`);
    win.document.write(contentEl.innerHTML);
    win.document.write(`</div></body>`);

    hidable.forEach(el => el.hidden = false);
  };

  return html`
    <h3>View Entries</h3>
    <form class="uk-grid-small" uk-grid="">
      <div class="uk-width-1-2@s">
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">From</label>
          <div class="uk-form-controls">
            <input class="uk-input"
              type="text"
              value=${fromDate}
              onChange=${e => setFromDate(e.target.value)}
            />
            <div class="date-dropdown" uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                <ul class="uk-nav uk-dropdown-nav">
                  ${fromDate && html`
                    <li><a onClick=${chooseDate('', setFromDate)} href="">[Clear]</a></li>
                  `}
                  ${fromDates.map(date => html`
                    <li><a onClick=${chooseDate(date, setFromDate)} href="">${date}</a></li>
                  `)}
                </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-width-1-2@s">
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">To</label>
          <div class="uk-form-controls">
            <input class="uk-input"
              type="text"
              value=${toDate}
              onChange=${e => setToDate(e.target.value)}
            />
            <div class="date-dropdown" uk-dropdown="mode: click; boundary: ! .uk-button-group; boundary-align: true;">
                <ul class="uk-nav uk-dropdown-nav">
                  ${toDate && html`
                    <li><a onClick=${chooseDate('', setToDate)} href="">[Clear]</a></li>
                  `}
                  ${toDates.map(date => html`
                    <li><a onClick=${chooseDate(date, setToDate)} href="">${date}</a></li>
                  `)}
                </ul>
            </div>
          </div>
        </div>
      </div>
    </form>

    <p>
      ${entries.length === 0 ? html`
        <em>No entries in this filter.</em>
      ` : html`
        <button class='uk-button' onClick=${exportAsHTML}>Export as HTML</button>
      `}
    </p>

    <div id="exportable-area">
    ${entries.map(({ date, entries, did, good }) => html`
      <div class="uk-child-width-expand@s" uk-grid="">
        <div class="uk-width-1-3@m">
          <div class="uk-card uk-card-default uk-card-body uk-text-center">
            <h4>
              ${date}
            </h4>
            <h5>
              ${good ? PassMark : FailMark} ${did} hours
            </h5>
          </div>
        </div>
        <div class="uk-width-2-3@m">
          <div class="">
            <table class="uk-table uk-table-small uk-table-divider uk-table-justify">
              <thead>
                <tr>
                  <th class="uk-table-shrink">Hours</th>
                  <th class="uk-table-shrink">Project</th>
                  <th class="uk-table-expand">Notes</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${entries.map(entry => html`
                  <${Row} refresh=${refresh} entry=${entry} />
                `)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `)}
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

  const [refreshes, setRefreshes] = React.useState(0);
  const refresh = () => setRefreshes(r => r + 1);

  return html`
    <${Header}/>

    <div class="uk-container">

      <${AddEntry} refresh=${refresh} />
      <hr/>
      <${ListEntries} refreshes=${refreshes} refresh=${refresh}/>

    </div>
  `;
});
