import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {fork, spawn} from 'redux-saga/effects';
import {orderbookSlice} from '../features/orderbook/orderbookSlice';
import * as OrderbookSlice from '../features/orderbook/orderbookSlice';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware({
  onError: error => {
    console.log('sagaerror', error);
  },
});

function* rootSaga() {
  yield fork(OrderbookSlice.rootSaga);
}
export const store = configureStore({
  reducer: {
    orderbook: orderbookSlice.reducer,
  },
  middleware: getDefaultMiddleware => {
    return [...getDefaultMiddleware({thunk: false}), sagaMiddleware];
  },
});
// Then run the saga
sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
