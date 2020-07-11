import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { request } from '../../util/request.js';
import { pushPath, pushLink } from '../../util/router.js';
import { UserContext } from '../../shared/user.js';
import { notifyResult } from '../../util/notify.js';

/**
 * @typedef Props
 * @property {object} params
 */
export default /** @type {React.FC<Props>} */((props) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const { user, setUser } = React.useContext(UserContext);
  if (user) return pushPath('/account');

  const submit = (e) => {
    e.preventDefault();

    (async () => {
      // Sign up
      const { ok, error } = await request('POST', '/api/users', { name, email, password });
      if (!ok) return notifyResult(ok, error);

      // Login
      await request('POST', '/api/users/auth', { email, password });

      // Get and store info
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
            <legend class="uk-legend">Sign-up</legend>
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
                Sign-up
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  `;
});
