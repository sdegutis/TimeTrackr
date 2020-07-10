import { React } from '../util/deps.js';
import { request } from '../util/request.js';
import { pushPath } from '../util/router.js';
import { UserContext } from '../user.js';

/**
 * @typedef Props
 * @property {object} params
 */
export default /** @type {React.FC<Props>} */((props) => {
  const { setUser } = React.useContext(UserContext);
  React.useEffect(() => {
    request('POST', '/api/users/deauth').then(() => {
      setUser(null);
      pushPath('/');
    });
  }, []);
  return null;
});
