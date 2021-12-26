import React from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {CardBackgroundColor} from '../../theme/colors';
import {OrderList} from './components/orderList';
import {Spread} from './components/spread';
import {orderbookSlice, selectors} from './orderbookSlice';
import {OrderListColumnSortOrder} from './types';

export function Orderbook() {
  const dispatch = useAppDispatch();
  const asks = useAppSelector(state => state.orderbook.asks);
  const bids = useAppSelector(state => state.orderbook.bids);
  const orderSidesDepths = useAppSelector(selectors.getOrderSidesDepths());
  const isWeb = Platform.OS === 'web' ? true : false;
  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Order Book </Text>
      <Button
        title="Subscribe"
        onPress={() => {
          dispatch(orderbookSlice.actions.subscribeToOrderbook());
        }}
      />
      <Button
        title="UnSubscribe"
        onPress={() => {
          dispatch(orderbookSlice.actions.unsubscribeToOrderbook());
        }}
      />
      {isWeb && (
        <View style={styles.spreadWebContainer}>
          <Spread />
        </View>
      )}
      <View style={{flexDirection: isWeb ? 'row' : 'column'}}>
        <OrderList
          items={bids}
          depths={orderSidesDepths.bidsDepths}
          depthColor="#132f23"
          priceColumnColor="#3eac2d"
          columnOrder={
            isWeb ? OrderListColumnSortOrder.TSP : OrderListColumnSortOrder.PST
          }
        />
        {!isWeb && <Spread />}
        <OrderList
          items={asks}
          depths={orderSidesDepths.asksDepths}
          depthColor="#341c25"
          priceColumnColor="#eb4057"
          columnOrder={OrderListColumnSortOrder.PST}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CardBackgroundColor,
  },
  heading: {
    color: '#fff',
  },
  spreadWebContainer: {
    alignSelf: 'center',
  },
});
