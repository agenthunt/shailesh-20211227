import React from 'react';
import {Provider} from 'react-redux';
import App from './App';
import {store} from './src/app/store';

export const AppWithProvider = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
