/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ApiClient } from './api/ApiClient';
import { BlogApi } from './api/types';
import s from './App.module.scss';
import { GrpcClient } from './grpc/GrpcClient';

const App: React.FC<{
  apiClient: ApiClient;
  grpcClient: GrpcClient;
}> = (p) => {
  const [blogLimit, setBlogLimit] = useState(50);

  const callApi = () => {
    console.time('api');
    const [res, cancel] = p.apiClient.getJson<BlogApi[]>(`blogs/${blogLimit}`);
    res
      .then((blogs) => {
        console.log('result length: ', blogs.length);
      })
      .finally(() => {
        console.timeEnd('api');
      });
  };

  const callGrpc = () => {
    console.time('grpc');
    p.grpcClient
      .GetBlogClient()
      .then((x) => x.getBlogs({ limit: blogLimit }))
      .then((response) => {
        console.log('result length: ', response.blogs.length);
      })
      .finally(() => {
        console.timeEnd('grpc');
      });
  };
  return (
    <div className={s.container}>
      <h1>Grpc test</h1>
      Blog length:{' '}
      <input
        type="number"
        defaultValue={blogLimit}
        onChange={(e) => {
          // eslint-disable-next-line radix
          setBlogLimit(parseInt(e.target.value));
        }}
      />
      <br />
      <br />
      <br />
      <button onClick={() => callApi()} type="button">
        Call api
      </button>
      <br />
      <br />
      <br />
      <button onClick={() => callGrpc()} type="button">
        Call grpc
      </button>
    </div>
  );
};

export default App;
