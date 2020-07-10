declare module "https://unpkg.com/es-react" {
  import * as React from 'react';
  import * as ReactDOM from 'react-dom';
  export { React, ReactDOM };
}

declare module "https://unpkg.com/htm?module" {
  import htm from 'htm';
  export default htm;
}

declare var UIkit: typeof import('uikit').default;

declare var jwt_decode: (str: string) => object;
