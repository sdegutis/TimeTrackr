import { React } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
import { Header } from '../shared/header.js';
const html = htm.bind(React.createElement);


// request('POST', '/api/users/auth', {
//   email: 'me@example.com',
//   password: 'foo',
// }).then(({ token }) => {
//   console.log('token:', token);

//   authToken = token;

//   console.log(jwt_decode(authToken));

// request('GET', '/api/users', {}).then(users => {
//   console.log(users);
// });


const LoginForm = () => {
  const submit = () => {

  };

  return html`
    <form>
      <fieldset class="uk-fieldset">
        <legend class="uk-legend">Login</legend>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Email</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="email"/>
          </div>
        </div>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Password</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="password"/>
          </div>
        </div>
        <div class="uk-margin">
          <button class="uk-button uk-button-primary" onClick=${submit}>Login</button>
        </div>
      </fieldset>
    </form>
  `;
};

const SignUpForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

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

  const submit = (e) => {
    e.preventDefault();

    // request('POST', '/api/users', { name, email, password }).then(({ token }) => {
    //   console.log({ token });

    //   request('GET', '/api/users').then(users => {
    //     console.log('well', users);
    //   });

    // });

  };

  return html`
    <form onSubmit=${submit}>
      <fieldset class="uk-fieldset">
        <legend class="uk-legend">Sign-up</legend>
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
  `;
};


/**
 * @typedef Props
 * @property {object} params
 */
export default /** @type {React.FC<Props>} */((props) => {
  return html`
    <${Header}/>
    <div class="uk-container">
      <div class="uk-child-width-expand@s uk-margin-top" uk-grid="">
        <div>
          <div class="uk-card uk-card-default uk-card-body">
            <${LoginForm}/>
          </div>
        </div>
        <div>
          <div class="uk-card uk-card-default uk-card-body">
            <${SignUpForm}/>
          </div>
        </div>
      </div>
    </div>
  `;
});
