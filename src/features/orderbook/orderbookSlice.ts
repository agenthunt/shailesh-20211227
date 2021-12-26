import {createSlice, PayloadAction, createSelector} from '@reduxjs/toolkit';
import {END, eventChannel, EventChannel} from 'redux-saga';
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import {createCryptoFacilitiesConnection} from '../../api/api';
import {RootState} from '../../app/store';
import {
  EventType,
  FeedType,
  MessagePayloadType,
  OrderbookState,
  OrderSideType,
  ProductIdType,
} from './types';
import {getProcessedOrderSides, normalizeOrders} from './utils';

const initialState: OrderbookState = {
  bids: [],
  asks: [],
  numLevels: 0,
  displaySize: 14,
  currentProductIds: [],
  subscribeToOrderbookInProgress: false,
  subscribeToOrderbookError: null,
  unSubscribeToOrderbookInProgress: false,
  unSubscribeToOrderbookError: null,
};

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    setNumLevels(state, action: PayloadAction<number>) {
      state.numLevels = action.payload;
    },
    subscribeToOrderbook(state) {
      state.subscribeToOrderbookInProgress = true;
      state.subscribeToOrderbookError = null;
    },
    unsubscribeToOrderbook(state) {},
    setOrders(
      state,
      action: PayloadAction<{
        asks: OrderSideType[];
        bids: OrderSideType[];
      }>,
    ) {
      state.asks = action.payload.asks;
      state.bids = action.payload.bids;
    },
    setCurrentProductIds(state, action) {
      state.currentProductIds = action.payload;
    },
  },
});

function createOrderbookEventChannel(socket: WebSocket) {
  const subscribeMessagePayload: MessagePayloadType = {
    event: EventType.SUBSCRIBE,
    feed: FeedType.BOOK_UI_1,
    product_ids: [ProductIdType.PI_XBTUSD],
  };
  socket.send(JSON.stringify(subscribeMessagePayload));

  return eventChannel(emit => {
    socket.onmessage = event => {
      emit(event.data);
    };

    socket.onclose = () => {
      emit(END);
    };

    const unsubscribe = () => {
      const unsubscripeMessagePayload: MessagePayloadType = {
        event: EventType.UNSUBSCRIBE,
        feed: FeedType.BOOK_UI_1,
        product_ids: [ProductIdType.PI_XBTUSD],
      };
      socket.send(JSON.stringify(unsubscripeMessagePayload));
      socket.onmessage = null;
      socket.close();
    };

    return unsubscribe;
  });
}

const workerSagas: any = {
  *subscribeToOrderbookSaga() {
    const socket: WebSocket = yield call(createCryptoFacilitiesConnection);

    // Connects and subscribes to orderbook event channel
    const orderbookEventChannel: EventChannel<unknown> = yield call(
      createOrderbookEventChannel,
      socket,
    );

    // processes events
    yield takeEvery(orderbookEventChannel, workerSagas.processEventSaga);

    // wait for unsubscribe action dispatch
    yield take(orderbookSlice.actions.unsubscribeToOrderbook.type);

    // unsuscribe and close eventchannel and socket
    orderbookEventChannel.close();
  },
  *processEventSaga(eventString: any) {
    const event = JSON.parse(eventString);
    if (
      event?.feed === FeedType.BOOK_UI_1 &&
      event?.event === EventType.SUBSCRIBED
    ) {
      yield put(
        orderbookSlice.actions.setCurrentProductIds(event?.product_ids),
      );
    } else if (
      (event?.feed === FeedType.BOOK_UI_1_SNAPSHOT ||
        event?.feed === FeedType.BOOK_UI_1) &&
      event?.event !== EventType.SUBSCRIBED
    ) {
      if (event?.numLevels) {
        yield put(orderbookSlice.actions.setNumLevels(event?.numLevels));
      }

      const orderbookSliceState: OrderbookState = yield select(
        state => state.orderbook,
      );
      const processedBids = getProcessedOrderSides({
        currentAsks: orderbookSliceState.asks,
        currentBids: orderbookSliceState.bids,
        deltaAsks: event?.asks,
        deltaBids: event?.bids,
      });

      yield put(
        orderbookSlice.actions.setOrders({
          bids: processedBids.newBids.slice(0, orderbookSliceState.displaySize),
          asks: processedBids.newAsks.slice(0, orderbookSliceState.displaySize),
        }),
      );
    }
  },
};

const watcherSagas: any = {
  *watchSubscribeToOrderbookRequest() {
    yield takeLatest(
      orderbookSlice.actions.subscribeToOrderbook.type,
      workerSagas.subscribeToOrderbookSaga,
    );
  },
};

export function* rootSaga() {
  const allSagas = Object.keys(watcherSagas).map(key =>
    fork(watcherSagas[key]),
  );
  yield all(allSagas);
}

export const selectors = {
  getOrderSidesDepths() {
    return createSelector(
      (state: RootState) => state.orderbook,
      (orderbookSlice: OrderbookState) => {
        const asksTotals: number[] = orderbookSlice.asks.map(ask => ask[2]);
        const bidsTotals: number[] = orderbookSlice.bids.map(bid => bid[2]);
        const highestAsksTotal = Math.max(...asksTotals);
        const highestBidsTotal = Math.max(...bidsTotals);
        const highestTotal = Math.max(highestBidsTotal, highestAsksTotal);
        const asksDepths = asksTotals.map(total => total / highestTotal);
        const bidsDepths = bidsTotals.map(total => total / highestTotal);
        return {
          asksDepths,
          bidsDepths,
        };
      },
    );
  },
  getSpread() {
    return createSelector(
      (state: RootState) => state.orderbook,
      (orderbookSlice: OrderbookState) => {
        if (orderbookSlice.bids.length > 1) {
          const highestBid: number = orderbookSlice.bids[0][0];
          const lowestAsk: number = orderbookSlice.asks[0][0];
          const priceFormatter = new Intl.NumberFormat('en', {
            minimumFractionDigits: 2,
          });
          return priceFormatter.format(Math.abs(highestBid - lowestAsk));
        }
      },
    );
  },
};
