/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src/App';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('app testing', () => {
  const initialState = {
    orderbook: {
      asks: [],
      bids: [],
    },
  };
  const mockStore = configureStore();
  let store;

  it('renders correctly', () => {
    store = mockStore(initialState);
    renderer.create(
      <Provider store={store}>
        <App />
      </Provider>,
    );
  });
});
