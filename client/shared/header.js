import { React, html } from '../util/deps.js';
import { pushLink } from '../util/router.js';
import { UserContext } from '../user.js';

export const Header = () => {
  const { user } = React.useContext(UserContext);

  return html`
    <nav class="uk-navbar-container" uk-navbar="">

      <div class="uk-navbar-left">

        <ul class="uk-navbar-nav">
          <li class="uk-active"><a href="/" onClick=${pushLink}>TimeTrackr</a></li>
        </ul>

      </div>

      <div class="uk-navbar-right">

        <ul class="uk-navbar-nav">
          ${user ? html`
            <li><a href="/logout" onClick=${pushLink}>Logout</a></li>
            ` : html`
            <li><a href="/login" onClick=${pushLink}>Login</a></li>
            <li><a href="/signup" onClick=${pushLink}>Signup</a></li>
          `}
        </ul>

      </div>

    </nav>
  `;
};
