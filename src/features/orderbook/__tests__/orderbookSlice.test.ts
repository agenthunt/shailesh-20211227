import {call, effectTypes, put, take} from 'redux-saga/effects';
import {expectSaga} from 'redux-saga-test-plan';
import {
  createOrderbookEventChannel,
  orderbookSlice,
  workerSagas,
} from '../orderbookSlice';
import {ProductIdType} from '../types';
import {createCryptoFacilitiesConnection} from '../../../api/api';
import {WebSocket} from 'mock-socket';
import * as matchers from 'redux-saga-test-plan/matchers';
import {RootState} from '../../../app/store';

describe('Orderbook Slice tests', () => {
  it('should subscribe to orderbook successfully', () => {
    const payload = [ProductIdType.PI_XBTUSD];
    const ws = new WebSocket('wss://local');
    return expectSaga(workerSagas.subscribeToOrderbookSaga, {payload})
      .provide([
        [call(createCryptoFacilitiesConnection), ws],
        [matchers.call.fn(createOrderbookEventChannel), 'eventChannel'],
      ])
      .put(orderbookSlice.actions.subscribeToOrderbookProgress())
      .put(orderbookSlice.actions.subscribeToOrderbookSuccess(payload))
      .run();
  });

  it('should toggle Feed successfully', () => {
    const newProductIds = [ProductIdType.PI_XBTUSD];
    const initialState: RootState = {
      orderbook: {
        bids: [],
        asks: [],
        numLevels: 0,
        isSubscriptionActive: false,
        displaySize: 14,
        currentProductIds: [],
        subscribeToOrderbookInProgress: false,
        subscribeToOrderbookError: null,
        unSubscribeToOrderbookInProgress: false,
        unSubscribeToOrderbookError: null,
      },
    };
    return expectSaga(workerSagas.toggleFeedSaga)
      .withState(initialState)
      .put(orderbookSlice.actions.subscribeToOrderbookRequest(newProductIds))
      .run();
  });
});
