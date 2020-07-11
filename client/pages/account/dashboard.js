import { React, html } from '../../util/deps.js';
import { Header } from '../../shared/header.js';
import { UserContext } from '../../user.js';
import { pushPath } from '../../util/router.js';

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  const { user } = React.useContext(UserContext);
  if (!user) return pushPath('/login');

  return html`
    <${Header}/>

    <div class="uk-section uk-section-primary uk-section-large uk-light">
        <div class="uk-container">

            <h3>Welcome ${user.email}</h3>

        </div>
    </div>
  `;
});
