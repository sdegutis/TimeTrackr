import { React } from 'https://unpkg.com/es-react';

import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);

export const Timer = ({ count }) => {
  return html`
    <p>the time = <b>${count}</b></p>
  `;
};

export const App = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    setInterval(() => {
      setCount(count => count + 1);
    }, 1000);
  }, []);

  return html`
    <h2>Hello world</h2>
    <${Timer} count=${count} />
  `;
};
