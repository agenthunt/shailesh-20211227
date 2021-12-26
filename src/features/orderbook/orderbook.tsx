import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  useAppDispatch,
  useAppSelector,
  useAppDimensions,
} from '../../app/hooks';
import {CardBackgroundColor} from '../../theme/colors';
import {OrderList} from './components/orderList';
import {Spread} from './components/spread';
import {orderbookSlice, selectors} from './orderbookSlice';
import {OrderListColumnSortOrder, ProductIdType} from './types';

function RowContainer({children}: {children: React.ReactElement}) {
  return <View style={{flex: 1, flexDirection: 'row'}}>{children}</View>;
}
function ColumnContainer({children}: {children: React.ReactElement}) {
  return <View style={{flex: 1, flexDirection: 'column'}}>{children}</View>;
}

export function Orderbook() {
  const dispatch = useAppDispatch();
  const {formattedAsks, formattedBids} = useAppSelector(
    selectors.getFormattedOrdersForOrderList(),
  );
  const currentProductIds = useAppSelector(
    state => state.orderbook.currentProductIds,
  );
  const isSubscribedToOrderbook = currentProductIds?.length > 0;
  const {isDesktop} = useAppDimensions();
  const bidsList = (
    <OrderList
      items={formattedBids}
      depthColor="#132f23"
      priceColumnColor="#3eac2d"
      columnOrder={
        isDesktop ? OrderListColumnSortOrder.TSP : OrderListColumnSortOrder.PST
      }
      hideHeader={!isDesktop}
    />
  );

  const asksList = (
    <OrderList
      items={formattedAsks}
      depthColor="#341c25"
      priceColumnColor="#eb4057"
      columnOrder={OrderListColumnSortOrder.PST}
      inverted={!isDesktop}
    />
  );

  const spreadDesktop = <Spread style={styles.spreadWebContainer} />;
  const spreadMobile = <Spread style={styles.spreadMobileContainer} />;

  const renderForWeb = (
    <>
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
          {spreadMobile}
          {bidsList}
        </>
      </ColumnContainer>
    </>
  );
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}> Order Book </Text>
        {isDesktop && spreadDesktop}
        <Text style={styles.currentProductIds}>
          {currentProductIds?.join(',')}
        </Text>
      </View>

      {isDesktop ? renderForWeb : renderForMobile}
      <View style={styles.buttonContainer}>
        {!isSubscribedToOrderbook && (
          <View style={styles.button}>
            <Button
              title="Subscribe"
              onPress={() => {
                dispatch(orderbookSlice.actions.toggleFeed());
              }}
            />
          </View>
        )}
        {isSubscribedToOrderbook && (
          <View style={styles.button}>
            <Button
              title="UnSubscribe"
              onPress={() => {
                dispatch(orderbookSlice.actions.unsubscribeToOrderbook());
              }}
            />
          </View>
        )}
        <View style={styles.button}>
          <Button
            title="Toggle Feed"
            onPress={() => {
              dispatch(orderbookSlice.actions.toggleFeed());
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: CardBackgroundColor,
    padding: 8,
  },
  headingContainer: {
    flexDirection: 'row',
  },
  heading: {
    fontSize: 40,
    color: '#fff',
  },
  spreadWebContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 'auto',
  },
  spreadMobileContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 'auto',
  },
  button: {
    alignSelf: 'center',
    margin: 8,
  },
  currentProductIds: {
    color: '#fff',
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
