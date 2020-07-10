import { React, html } from '../util/deps.js';
import { pushLink } from '../util/router.js';
import { UserContext } from '../user.js';

export const Header = () => {
  const { user } = React.useContext(UserContext);

  return html`
    <nav class="uk-navbar-container" uk-navbar="">

      <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="/" onClick=${pushLink}>TimeTrackr</a>

      </div>

      <div class="uk-navbar-right">

        <ul class="uk-navbar-nav">
          ${user ? html`
            <li><a href="/account" onClick=${pushLink}>Account</a></li>
            <li><a href="/logout" onClick=${pushLink}>Logout</a></li>
            ` : html`
            <li><a href="/login" onClick=${pushLink}>Login</a></li>
            <li><a href="/signup" onClick=${pushLink}>Signup</a></li>
          `}
        </ul>

      </div>

    </nav>

    ${user && html`
      <div class="uk-container uk-margin">
        <ul class="uk-subnav uk-subnav-pill" uk-margin="">
          <li class="${location.pathname === '/account' ? 'uk-active' : ''}">
            <a onClick=${pushLink} href="/account">Dashboard</a>
          </li>
          <li class="${location.pathname === '/account/settings' ? 'uk-active' : ''}">
            <a onClick=${pushLink} href="/account/settings">Settings</a>
          </li>
        </div>
      </ul>
    `}
  `;
};
