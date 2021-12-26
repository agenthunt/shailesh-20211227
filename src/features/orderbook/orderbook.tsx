import React, {FC} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../app/hooks';
import {CardBackgroundColor} from '../../theme/colors';
import {OrderList} from './components/orderList';
import {Spread} from './components/spread';
import {orderbookSlice, selectors} from './orderbookSlice';
import {OrderListColumnSortOrder} from './types';

function RowContainer({children}: {children: React.ReactElement}) {
  return <View style={{flex: 1, flexDirection: 'row'}}>{children}</View>;
}
function ColumnContainer({children}: {children: React.ReactElement}) {
  return <View style={{flex: 1, flexDirection: 'column'}}>{children}</View>;
}

export function Orderbook() {
  const dispatch = useAppDispatch();
  const asks = useAppSelector(state => state.orderbook.asks);
  const bids = useAppSelector(state => state.orderbook.bids);
  const orderSidesDepths = useAppSelector(selectors.getOrderSidesDepths());
  const isWeb = Platform.OS === 'web' ? true : false;

  const bidsList = (
    <OrderList
      items={bids}
      depths={orderSidesDepths.bidsDepths}
      depthColor="#132f23"
      priceColumnColor="#3eac2d"
      columnOrder={
        isWeb ? OrderListColumnSortOrder.TSP : OrderListColumnSortOrder.PST
      }
      hideHeader={!isWeb}
    />
  );

  const asksList = (
    <OrderList
      items={asks}
      depths={orderSidesDepths.asksDepths}
      depthColor="#341c25"
      priceColumnColor="#eb4057"
      columnOrder={OrderListColumnSortOrder.PST}
      inverted={!isWeb}
    />
  );

  const spread = <Spread style={styles.spreadWebContainer} />;

  const renderForWeb = (
    <>
      {spread}
      <RowContainer>
        <>
          {bidsList}
          {asksList}
        </>
      </RowContainer>
    </>
  );
  const renderForMobile = (
    <>
      <ColumnContainer>
        <>
          {asksList}
          {spread}
          {bidsList}
        </>
      </ColumnContainer>
    </>
  );
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
      {isWeb ? renderForWeb : renderForMobile}
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
