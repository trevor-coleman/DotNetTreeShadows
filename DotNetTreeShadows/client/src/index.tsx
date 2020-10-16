// noinspection ES6UnusedImports
import './env';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import persistedStore from './store'
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import {PersistGate} from "redux-persist/integration/react";

console.log(process.env.TREE_SHADOWS_API_URL);

const {store, persistor} = persistedStore;

const Loading = ()=><h1>HI EVERYBODY</h1>

ReactDOM.render(
      <Provider store={store}>
          <PersistGate loading={<Loading/>} persistor={persistor}>
          <App />
          </PersistGate>
      </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
