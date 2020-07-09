import { React } from 'https://unpkg.com/es-react';

import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);

export const Timer = ({ count }) => {
  return html`
    <div uk-alert="">
      <p>the time = <b>${count}</b></p>
    </div>
  `;
};

export const App = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {

    (async () => {

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'me',
          email: 'me3@example.com',
          password: 'foo',
        }),
      });

      if (response.status !== 200) {
        console.log('Error:', response.status);
      }

      const { token } = await response.json();

      console.log('token:', token);
    })();

    setInterval(() => {
      setCount(oldCount => oldCount + 1);
    }, 1000);
  }, []);

  return html`
    <nav class="uk-navbar-container" uk-navbar="">
        <div class="uk-navbar-left">

            <ul class="uk-navbar-nav">
                <li class="uk-active"><a href="#">Active</a></li>
                <li>
                    <a href="#">Parent</a>
                    <div class="uk-navbar-dropdown">
                        <ul class="uk-nav uk-navbar-dropdown-nav">
                            <li class="uk-active"><a href="#">Active</a></li>
                            <li><a href="#">Item</a></li>
                            <li><a href="#">Item</a></li>
                        </ul>
                    </div>
                </li>
                <li><a href="#">Item</a></li>
            </ul>

        </div>
    </nav>

    <div class="uk-container">

      <h2>Hello world</h2>
      <${Timer} count=${count} />
    </div>
  `;
};
