import { React, ReactDOM } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
import { FlatRouter } from './router.js';
const html = htm.bind(React.createElement);

const Landing = React.lazy(() => import('./pages/landing.js'));
const Login = React.lazy(() => import('./pages/login.js'));

const Loading = html`<div uk-spinner="ratio: 3"></div>`;

const App = /** @type {React.FC} */(() => {
  return html`
    <${FlatRouter} loading=${Loading} routes=${{
      '/login': Login,
      '/': Landing,
    }}/>
  `;
});

ReactDOM.render(
  React.createElement(App),
  document.getElementById('root')
);
