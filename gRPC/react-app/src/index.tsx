import getEnv, { EnvError, str } from 'cra-env-settings';
import React from 'react';
import ReactDOM from 'react-dom';
import { ApiClient } from './api/ApiClient';
import App from './App';
import { GrpcClient } from './grpc/GrpcClient';
import * as serviceWorker from './serviceWorker';

export interface Env {
  REACT_APP_GRPC_PATH: string;
  REACT_APP_API_PATH: string;
}
const env = getEnv<Env>({
  REACT_APP_GRPC_PATH: str(),
  REACT_APP_API_PATH: str(),
});

const rootEl = document.getElementById('root');
if (env instanceof EnvError) {
  ReactDOM.render(
    <div>
      Env error!
      <p>{env.message}</p>
      <pre>{JSON.stringify(env.errors, null, 2)}</pre>
    </div>,
    rootEl,
  );
} else {
  ReactDOM.render(
    <App
      apiClient={new ApiClient(env.REACT_APP_API_PATH)}
      grpcClient={new GrpcClient(env.REACT_APP_GRPC_PATH)}
    />,
    rootEl,
  );
}
serviceWorker.unregister();
