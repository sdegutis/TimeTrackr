import { React } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);

console.log('loading mod!');

export default (props) => {
  return html`
    <b>inside here!</b>
  `;
};
