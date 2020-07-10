import { React, html } from '../util/deps.js';

// Slight hack, because we set this in a mount-effect.
// This means we can only have one (top-level) FlatRouter.
// ... Which I'm totally okay with.
let pathChanged = () => { };

// It's easier to compose functions than disparate components.
// Therefore this is just a function, which you set on onClick.
// (Or you can compose it within existing click handlers.)
export const pushPath = (e) => {
  e.preventDefault();
  history.pushState(null, document.title, e.target.getAttribute('href'));
  pathChanged();
};

/**
 * @param {object} props
 * @param {{[pattern: string]: React.FC<{params: object | undefined}>}} props.routes
 * @param {React.ReactElement} props.loading
 */
export const FlatRouter = ({ routes, loading }) => {
  const [path, setPath] = React.useState(location.pathname);

  React.useEffect(() => {
    pathChanged = () => setPath(location.pathname);
    window.addEventListener('popstate', pathChanged);
    return () => {
      window.removeEventListener('popstate', pathChanged);
    };
  }, []);

  const route = Object.entries(routes).map(([pattern, Comp]) => {
    if (pattern === '') return { match: true, Comp };
    const regex = pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)');
    const match = path.match(new RegExp(`^${regex}$`));
    const params = match?.groups;
    return { match, Comp, params, pattern };
  }).find(({ match }) => match);

  return html`
    <${React.Suspense} fallback=${loading}>
      <${route.Comp} params=${route.params}/>
    <//>
  `;
};
