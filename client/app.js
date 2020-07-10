import { React, ReactDOM, html } from './util/deps.js';
import { FlatRouter } from './util/router.js';

const Landing = React.lazy(() => import('./pages/landing.js'));
const Login = React.lazy(() => import('./pages/login.js'));
const SignUp = React.lazy(() => import('./pages/signup.js'));
const NotFound = React.lazy(() => import('./pages/notfound.js'));

const Loading = html`<div uk-spinner="ratio: 3"></div>`;

const App = /** @type {React.FC} */(() => {
  return html`
        <${FlatRouter} loading=${Loading} routes=${{
      '/login': Login,
      '/signup': SignUp,
      '/': Landing,
      '': NotFound,
    }}/>
      `;
});

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
