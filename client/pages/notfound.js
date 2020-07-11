import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';

/**
 * @typedef Props
 * @property {object} params
 */
export default /** @type {React.FC<Props>} */((props) => {
  return html`
    <${Header}/>
    <div class="uk-container uk-margin">
      <div class="uk-alert-warning" uk-alert="">
        <h3>404</h3>
        <p>Page not found.</p>
      </div>
    </div>
  `;
});
