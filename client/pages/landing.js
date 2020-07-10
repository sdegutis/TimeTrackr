import { React } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
import { pushPath } from '../router.js';
import { Header } from '../shared/header.js';
const html = htm.bind(React.createElement);

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
    <${Header}/>

    <p><a href="/foo/bar" onClick=${pushPath}>/foo/bar</a></p>
    <p><a href="/login" onClick=${pushPath}>/login</a></p>
    <p><a href="/signup" onClick=${pushPath}>/signup</a></p>
    <p><a href="/foo/bar2" onClick=${pushPath}>/foo/bar2</a></p>
    <p><a href="/foo/bar/qux" onClick=${pushPath}>/foo/bar/qux</a></p>
    <p><b>inside ${props.params} here!</b></p>
  `;
});
