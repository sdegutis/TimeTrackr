import { React } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);

console.log('loading mod!');

/**
 * @typedef Props
 * @property {number} foo
 */

export default /** @type {React.FC<Props>} */((props) => {
  return html`
    <b>inside ${props.foo} here!</b>
  `;
});
