import { React, ReactDOM, html } from './util/deps.js';
import { FlatRouter } from './util/router.js';
import { UserContext } from './user.js';
import { request } from './util/request.js';

const Landing = React.lazy(() => import('./pages/landing.js'));
const AccountDashboard = React.lazy(() => import('./pages/account-dashboard.js'));
const AccountSettings = React.lazy(() => import('./pages/account-settings.js'));
const Login = React.lazy(() => import('./pages/login.js'));
const Logout = React.lazy(() => import('./pages/logout.js'));
const SignUp = React.lazy(() => import('./pages/signup.js'));
const NotFound = React.lazy(() => import('./pages/notfound.js'));

const Loading = html`<div uk-spinner="ratio: 3"></div>`;

const App = /** @type {React.FC} */(() => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    request('GET', '/api/account/info').then(({ info }) => {
      setUser(info);
    });
  }, []);

  // Auto-indenting isn't quite right yet here (oh well):
  return html`
    <${UserContext.Provider} value=${{ user, setUser }}>
    <${FlatRouter} loading=${Loading} routes=${{
      '/login': Login,
      '/logout': Logout,
      '/account': AccountDashboard,
      '/account/settings': AccountSettings,
      '/signup': SignUp,
      '/': Landing,
      '': NotFound,
    }}/>
    <//>
  `;
});

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
