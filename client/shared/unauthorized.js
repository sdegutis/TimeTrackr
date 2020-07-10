import { html } from "../util/deps.js";
import { Header } from "./header.js";

export const NotAuthorized = html`
  <${Header}/>
  <div class="uk-container">
    <div class="uk-alert-danger" uk-alert="">
      <p>Unauthorized to access this page.</p>
    </div>
  </div>
`;
