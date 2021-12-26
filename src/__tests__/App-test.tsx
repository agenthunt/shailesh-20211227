/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

describe('App component tests', () => {
  const initialState = {
    orderbook: {
      asks: [],
      bids: [],
    },
  };
  const mockStore = configureStore();
  let store;

  it('renders default state of App.jsx correctly', () => {
    store = mockStore(initialState);
    const tree = renderer
      .create(
        <Provider store={store}>
          <App />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
