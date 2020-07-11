import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { UserContext } from '../../shared/user.js';
import { pushPath } from '../../util/router.js';
import { request } from '../../util/request.js';

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  const { user, setUser } = React.useContext(UserContext);
  if (!user) return pushPath('/login');

  const [name, setName] = React.useState(user.name);
  const [targetDailyHours, setTargetDailyHours] = React.useState(user.targetDailyHours);
  const [error, setError] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();

    setError(false);
    (async () => {
      const { ok } = await request('POST', '/api/account/setinfo', { name, targetDailyHours });
      if (!ok) return setError(true);

      const { info } = await request('GET', '/api/account/info');
      setUser(info);

      UIkit.notification({
        message: 'Settings changed successfully.',
        status: 'success',
        pos: 'bottom-left',
      })
    })();
  };

  return html`
    <${Header}/>
    <div class="uk-container uk-margin uk-flex">
      <div class="uk-width-1-2">
        <form onSubmit=${submit}>
          <fieldset class="uk-fieldset">
            ${error && html`
              <div class="uk-alert-warning" uk-alert="">
                <a class="uk-alert-close" uk-close="" onClick=${() => setError(false)}></a>
                <p>Something went wrong. Please try again later.</p>
              </div>
            `}
            <div class="uk-margin">
              <label class="uk-form-label" for="form-stacked-text">Name</label>
              <div class="uk-form-controls">
                <input class="uk-input"
                  autoFocus
                  type="text"
                  value=${name}
                  onChange=${e => setName(e.target.value)}
                />
              </div>
            </div>
            <div class="uk-margin">
              <label class="uk-form-label" for="form-stacked-text">Target Daily Hours</label>
              <div class="uk-form-controls">
                <input class="uk-input"
                  type="text"
                  value=${targetDailyHours}
                  onChange=${e => setTargetDailyHours(e.target.value)}
                />
              </div>
            </div>
            <div class="uk-margin">
              <button
                class="uk-button uk-button-primary"
                onclick=${submit}
              >
                Update
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  `;
});
