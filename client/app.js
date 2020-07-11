import { React, ReactDOM, html } from './util/deps.js';
import { FlatRouter } from './util/router.js';
import { UserContext } from './shared/user.js';
import { request } from './util/request.js';
import { Header } from './shared/header.js';

const Landing = React.lazy(() => import('./pages/landing.js'));
const AccountDashboard = React.lazy(() => import('./pages/account/dashboard.js'));
const AccountSettings = React.lazy(() => import('./pages/account/settings.js'));
const ManageUsers = React.lazy(() => import('./pages/manage/users.js'));
const ManageEntries = React.lazy(() => import('./pages/manage/entries.js'));
const Login = React.lazy(() => import('./pages/auth/login.js'));
const Logout = React.lazy(() => import('./pages/auth/logout.js'));
const SignUp = React.lazy(() => import('./pages/auth/signup.js'));
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
    <div>
    <${FlatRouter} loading=${Loading} routes=${{
      '/login': Login,
      '/logout': Logout,
      '/account': AccountDashboard,
      '/account/settings': AccountSettings,
      '/manage/users': ManageUsers,
      '/manage/entries': ManageEntries,
      '/signup': SignUp,
      '/': Landing,
      '': NotFound,
    }}/>
    <div class="uk-section uk-section-muted uk-margin-xlarge-top">
        <div class="uk-container">
          <p>Copyright © ${new Date().getFullYear()} Steven Degutis. All rights reserved.</p>
        </div>
    </div>
    </div>
    <//>
  `;
});

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
