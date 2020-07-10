import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';
import { request } from '../util/request.js';
import { pushPath } from '../util/router.js';
import { UserContext } from '../user.js';

/**
 * @typedef Props
 * @property {object} params
 */
export default /** @type {React.FC<Props>} */((props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);

  const { user, setUser } = React.useContext(UserContext);
  if (user) return pushPath('/account');

  const submit = (e) => {
    e.preventDefault();

    setError(false);
    (async () => {
      const { token } = await request('POST', '/api/users/auth', { email, password });
      if (!token) return setError(true);

      const { info } = await request('GET', '/api/account/info');
      setUser(info);
      pushPath("/account");
    })();
  };

  return html`
    <${Header}/>
    <div class="uk-container uk-margin uk-flex uk-flex-center">
      <div class="uk-width-1-2">
        <form onSubmit=${submit}>
          <fieldset class="uk-fieldset">
            <legend class="uk-legend">Login</legend>
            ${error && html`
              <div class="uk-alert-warning" uk-alert="">
                <a class="uk-alert-close" uk-close="" onClick=${() => setError(false)}></a>
                <p>Invalid email or password. Try again.</p>
              </div>
            `}
            <div class="uk-margin">
              <label class="uk-form-label" for="form-stacked-text">Email</label>
              <div class="uk-form-controls">
                <input class="uk-input"
                  autoFocus
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
              <button
                class="uk-button uk-button-primary"
                onclick=${submit}
                disabled=${password.length === 0}
              >
                Login
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  `;
});
