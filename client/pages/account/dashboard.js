import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { UserContext } from '../../user.js';
import { pushPath } from '../../util/router.js';
import { request } from '../../util/request.js';
import { notifyResult } from '../../util/notify.js';

const today = () => new Date().toISOString().split('T')[0];

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
    UIkit.dropdown(document.getElementById('choose-project-dropdown')).hide();
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

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  const { user } = React.useContext(UserContext);
  if (!user) return pushPath('/login');

  const refresh = () => { };

  return html`
    <${Header}/>

    <div class="uk-container">

      <${AddEntry} refresh=${refresh} />

    </div>
  `;
});
