import { React } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);

console.log('loading mod!');

/**
 * @typedef Props
 * @property {object} params
 */

export default /** @type {React.FC<Props>} */((props) => {
  React.useEffect(() => {
    console.log('mounting');
    return () => {
      console.log('unmounting');
    };
  }, []);

  return html`
    <b>inside ${props.params} here!</b>
  `;
});
