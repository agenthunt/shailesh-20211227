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
  OrderListItemType,
  OrderSideType,
  ProductIdType,
} from './types';
import {
  getProcessedOrderSides,
  normalizeOrders,
  processOrderSide,
} from './utils';

const initialState: OrderbookState = {
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
};

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    setNumLevels(state, action: PayloadAction<number>) {
      state.numLevels = action.payload;
    },
    subscribeToOrderbook(state, action: PayloadAction<ProductIdType[]>) {
      state.subscribeToOrderbookInProgress = true;
      state.subscribeToOrderbookError = null;
      state.currentProductIds = action.payload;
    },
    subscribeToOrderbookSuccess(state) {
      state.subscribeToOrderbookInProgress = false;
      state.subscribeToOrderbookError = null;
      state.isSubscriptionActive = true;
      state.asks = [];
      state.bids = [];
    },
    unsubscribeToOrderbook(state) {
      state.unSubscribeToOrderbookInProgress = true;
      state.unSubscribeToOrderbookError = null;
    },
    unsubscribeToOrderbookSuccess(state) {
      state.unSubscribeToOrderbookInProgress = false;
      state.unSubscribeToOrderbookError = null;
      state.currentProductIds = [];
      state.isSubscriptionActive = false;
    },
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
    toggleFeed() {},
  },
});

function createOrderbookEventChannel(
  socket: WebSocket,
  product_ids: ProductIdType[],
) {
  const subscribeMessagePayload: MessagePayloadType = {
    event: EventType.SUBSCRIBE,
    feed: FeedType.BOOK_UI_1,
    product_ids,
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
        product_ids,
      };
      socket.send(JSON.stringify(unsubscripeMessagePayload));
      socket.onmessage = null;
      socket.close();
    };

    return unsubscribe;
  });
}

const workerSagas: any = {
  *subscribeToOrderbookSaga({payload}: {payload: ProductIdType[]}) {
    const socket: WebSocket = yield call(createCryptoFacilitiesConnection);
    const orderbookSliceState: OrderbookState = yield select(
      state => state.orderbook,
    );

    // Connects and subscribes to orderbook event channel
    const orderbookEventChannel: EventChannel<unknown> = yield call(
      createOrderbookEventChannel,
      socket,
      orderbookSliceState.currentProductIds,
    );

    // processes events
    yield put(orderbookSlice.actions.subscribeToOrderbookSuccess());
    yield takeEvery(orderbookEventChannel, workerSagas.processEventSaga);

    // wait for unsubscribe action dispatch
    yield take(orderbookSlice.actions.unsubscribeToOrderbook.type);

    // unsuscribe and close eventchannel and socket
    orderbookEventChannel.close();
    yield put(orderbookSlice.actions.unsubscribeToOrderbookSuccess());
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
      const processedOrderSides = getProcessedOrderSides({
        currentAsks: orderbookSliceState.asks,
        currentBids: orderbookSliceState.bids,
        deltaAsks: event?.asks,
        deltaBids: event?.bids,
      });
      const trimSize = Math.min(
        processedOrderSides.newBids.length,
        processedOrderSides.newBids.length,
        orderbookSliceState.displaySize,
      );
      yield put(
        orderbookSlice.actions.setOrders({
          bids: processedOrderSides.newBids.slice(0, trimSize),
          asks: processedOrderSides.newAsks.slice(0, trimSize),
        }),
      );
    }
  },
  *toggleFeedSaga() {
    const orderbookSliceState: OrderbookState = yield select(
      state => state.orderbook,
    );

    //unsubscribe
    if (orderbookSliceState.isSubscriptionActive) {
      yield put(orderbookSlice.actions.unsubscribeToOrderbook());
    }

    //change currentProductIds
    let newProductIds = orderbookSliceState.currentProductIds;
    if (orderbookSliceState.currentProductIds[0] === ProductIdType.PI_ETHUSD) {
      newProductIds = [ProductIdType.PI_XBTUSD];
    } else if (
      orderbookSliceState.currentProductIds[0] === ProductIdType.PI_XBTUSD
    ) {
      newProductIds = [ProductIdType.PI_ETHUSD];
    } else {
      newProductIds = [ProductIdType.PI_XBTUSD];
    }
    yield put(orderbookSlice.actions.subscribeToOrderbook(newProductIds));
  },
};

const watcherSagas: any = {
  *watchSubscribeToOrderbookRequest() {
    yield takeLatest(
      orderbookSlice.actions.subscribeToOrderbook.type,
      workerSagas.subscribeToOrderbookSaga,
    );
  },
  *watchToggleFeedRequest() {
    yield takeLatest(
      orderbookSlice.actions.toggleFeed.type,
      workerSagas.toggleFeedSaga,
    );
  },
};

export function* rootSaga() {
  const allSagas = Object.keys(watcherSagas).map(key =>
    fork(watcherSagas[key]),
  );
  yield all(allSagas);
}

const priceFormatter = new Intl.NumberFormat('en', {
  minimumFractionDigits: 2,
});
const sizeFormatter = new Intl.NumberFormat('en', {minimumFractionDigits: 0});

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
  getFormattedOrdersForOrderList() {
    return createSelector(
      (state: RootState) => state.orderbook,
      selectors.getOrderSidesDepths(),
      (
        orderbookSlice,
        {asksDepths, bidsDepths}: {asksDepths: number[]; bidsDepths: number[]},
      ) => {
        const formattedAsks: OrderListItemType[] = orderbookSlice.asks.map(
          (item, index) => {
            return {
              price: priceFormatter.format(item[0]),
              size: sizeFormatter.format(item[1]),
              total: sizeFormatter.format(item[2]),
              depth: asksDepths[index],
            };
          },
        );
        const formattedBids: OrderListItemType[] = orderbookSlice.bids.map(
          (item, index) => {
            return {
              price: priceFormatter.format(item[0]),
              size: sizeFormatter.format(item[1]),
              total: sizeFormatter.format(item[2]),
              depth: bidsDepths[index],
            };
          },
        );
        return {
          formattedAsks,
          formattedBids,
        };
      },
    );
  },
};
