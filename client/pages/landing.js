import { React, html } from '../util/deps.js';
import { Header } from '../shared/header.js';

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  return html`
    <${Header}/>

    <div class="uk-section uk-section-primary uk-section-large uk-light">
        <div class="uk-container">

            <h3>TimeTrackr</h3>

            <div class="uk-grid-match uk-child-width-1-3@m" uk-grid="">
                <div>
                    <p>Useful way to track time for various client projects. Use the links above to navigate through this site.</p>
                </div>
                <div>
                    <p>Notable features include the ability to track time for multiple clients, and generate time sheets.</p>
                </div>
                <div>
                    <p>This project is made using modern web app best practices. It also has no compile-time phase, it just runs.</p>
                </div>
            </div>

        </div>
    </div>
  `;
});
