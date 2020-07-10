import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';
import { request } from '../util/request.js';
import { pushLink, pushPath } from '../util/router.js';

const SignUpForm = () => {

  // React.useEffect(() => {

  //   // request('POST', '/api/users/deauth').then(() => {
  //   //   console.log('deauthed');

  //   request('GET', '/api/users/info').then(info => {
  //     console.log(info);
  //   });

  //   request('GET', '/api/users').then(users => {
  //     console.log(users);
  //   });

  //   // });

  // }, []);

  return html`
  `;
};


// request('GET', '/api/users').then(users => {
//   console.log('well', users);
// });


/**
 * @typedef Props
 * @property {object} params
 */
export default /** @type {React.FC<Props>} */((props) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  const [error, setError] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    request('POST', '/api/users', { name, email, password }).then(({ token }) => {
      if (token) {
        setError(false);
        pushPath("/account");
      }
      else {
        setError(true);
      }
    });
  };

  return html`
    <${Header}/>
    <div class="uk-container uk-margin uk-flex uk-flex-center">
      <div class="uk-width-1-2">
        <form onSubmit=${submit}>
          <fieldset class="uk-fieldset">
            <legend class="uk-legend">Sign-up</legend>
            ${error && html`
              <div class="uk-alert-warning" uk-alert="">
                <a class="uk-alert-close" uk-close="" onClick=${() => setError(false)}></a>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
              </div>
            `}
            <div class="uk-margin">
              <label class="uk-form-label" for="form-stacked-text">Name</label>
              <div class="uk-form-controls">
                <input class="uk-input"
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
