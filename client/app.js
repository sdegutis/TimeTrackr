import { React } from 'https://unpkg.com/es-react';
import htm from 'https://unpkg.com/htm?module';
import { FlatRouter, pushPath } from './router.js';
const html = htm.bind(React.createElement);

export const Timer = ({ count }) => {
  return html`
    <div uk-alert="">
      <p>the time = <b>${count}</b></p>
    </div>
  `;
};

async function request(method, url, body) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
    return await response.json();
  }
  catch (err) {
    return { err };
  }
}

const Root = React.lazy(() => import('./pages/root.js'));

const LoginForm = () => {

  const [on, setOn] = React.useState(false);

  const submit = (e) => {
    e.preventDefault();
    console.log('ok');

    setOn(on => !on);

    // import('./foo.js').then(({ Foo }) => {
    //   Foo();
    // });


  };

  return html`
    <form>
      <${React.Suspense} fallback=${html`<b>loading...</b>`}>
        ${on && html`<${Root}/>`}
      <//>
      <fieldset class="uk-fieldset">
        <legend class="uk-legend">Login</legend>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Email</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="email"/>
          </div>
        </div>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Password</label>
          <div class="uk-form-controls">
            <input class="uk-input" type="password"/>
          </div>
        </div>
        <div class="uk-margin">
          <button class="uk-button uk-button-primary" onClick=${submit}>Login</button>
        </div>
      </fieldset>
    </form>
  `;
};

const SignUpForm = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');

  React.useEffect(() => {

    // request('POST', '/api/users/deauth').then(() => {
    //   console.log('deauthed');

    request('GET', '/api/users/info').then(info => {
      console.log(info);
    });

    request('GET', '/api/users').then(users => {
      console.log(users);
    });

    // });

  }, []);

  const submit = (e) => {
    e.preventDefault();

    request('POST', '/api/users', { name, email, password }).then(({ token }) => {
      console.log({ token });

      request('GET', '/api/users').then(users => {
        console.log('well', users);
      });

    });

  };

  return html`
    <form onSubmit=${submit}>
      <fieldset class="uk-fieldset">
        <legend class="uk-legend">Sign-up</legend>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Name</label>
          <div class="uk-form-controls">
            <input class="uk-input"
              type="text"
              value=${name}
              onChange=${e => setName(e.target.value)}
            />
          </div>
        </div>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Email</label>
          <div class="uk-form-controls">
            <input class="uk-input"
              type="email"
              value=${email}
              onChange=${e => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Password</label>
          <div class="uk-form-controls">
            <input class="uk-input"
              type="password"
              value=${password}
              onChange=${e => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div class="uk-margin">
          <label class="uk-form-label" for="form-stacked-text">Again</label>
          <div class="uk-form-controls">
            <input class="uk-input"
              type="password"
              value=${password2}
              onChange=${e => setPassword2(e.target.value)}
            />
          </div>
        </div>
        <div class="uk-margin">
          <button
            class="uk-button uk-button-primary"
            onclick=${submit}
            disabled=${password.length === 0 || password !== password2}
          >
            Sign-up
          </button>
        </div>
      </fieldset>
    </form>
  `;
};


const Root2 = /** @type {React.FC<{params: object}>} */((props) => {
  React.useEffect(() => {
    console.log('mounting');
    return () => {
      console.log('unmounting');
    };
  }, []);

  return html`
    <p><a href="/" onClick=${pushPath}>home</a></p>
    <p><a href="qux" onClick=${pushPath}>qux</a></p>
    <p><b>usr = ${props.params.user} here!</b></p>
  `;
});

const Loading = html`
  <b>loading...</b>
`;

export const App = /** @type {React.FC} */(() => {
  return html`
    <${FlatRouter} loading=${Loading} routes=${{
      '/users': Root,
      '/login': Root,
      '/foo/bar2': Root,
      '/foo/bar/:user': Root2,
      '/foo/:user': Root2,
      '/signup': Root,
      '/': Root,
    }}/>
  `;

  return html`
    <div class="uk-container">
      <div class="uk-child-width-expand@s uk-margin-top" uk-grid="">
        <div>
          <div class="uk-card uk-card-default uk-card-body">
            <${LoginForm}/>
          </div>
        </div>
        <div>
          <div class="uk-card uk-card-default uk-card-body">
            <${SignUpForm}/>
          </div>
        </div>
      </div>
    </div>
  `;

  // const [count, setCount] = React.useState(0);

  // React.useEffect(() => {

  //   // request('POST', '/api/users/auth', {
  //   //   email: 'me@example.com',
  //   //   password: 'foo',
  //   // }).then(({ token }) => {
  //   //   console.log('token:', token);

  //   //   authToken = token;

  //   //   console.log(jwt_decode(authToken));

  //   request('GET', '/api/users', {}).then(users => {
  //     console.log(users);
  //   });


  //   // });

  //   setInterval(() => {
  //     setCount(oldCount => oldCount + 1);
  //   }, 1000);
  // }, []);

  // return html`
  //   <nav class="uk-navbar-container" uk-navbar="">
  //       <div class="uk-navbar-left">

  //           <ul class="uk-navbar-nav">
  //               <li class="uk-active"><a href="#">Active</a></li>
  //               <li>
  //                   <a href="#">Parent</a>
  //                   <div class="uk-navbar-dropdown">
  //                       <ul class="uk-nav uk-navbar-dropdown-nav">
  //                           <li class="uk-active"><a href="#">Active</a></li>
  //                           <li><a href="#">Item</a></li>
  //                           <li><a href="#">Item</a></li>
  //                       </ul>
  //                   </div>
  //               </li>
  //               <li><a href="#">Item</a></li>
  //           </ul>

  //       </div>
  //   </nav>

  //   <div class="uk-container">

  //     <h2>Hello world</h2>
  //     <${Timer} count=${count} />
  //   </div>
  // `;
});
