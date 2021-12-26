import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  useAppDispatch,
  useAppSelector,
  useAppDimensions,
} from '../../app/hooks';
import {LedButton} from '../../components/ledButton';
import {CardBackgroundColor} from '../../theme/colors';
import {LED_FONT_FAMILY} from '../../theme/fonts';
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
      depthColor="#134f23"
      priceColumnColor="#3eac2d"
      columnOrder={
        isDesktop ? OrderListColumnSortOrder.TSP : OrderListColumnSortOrder.PST
      }
      hideHeader={!isDesktop}
      flipDepthLevelDirection={isDesktop}
    />
  );

  const asksList = (
    <OrderList
      items={formattedAsks}
      depthColor="#641c25"
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
    <View style={[styles.container, {height: isDesktop ? '100vh' : '100%'}]}>
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
            <LedButton
              title="Subscribe"
              onPress={() => {
                dispatch(orderbookSlice.actions.toggleFeed());
              }}
            />
          </View>
        )}
        {isSubscribedToOrderbook && (
          <View style={styles.button}>
            <LedButton
              title="Unsubscribe"
              onPress={() => {
                dispatch(orderbookSlice.actions.unsubscribeToOrderbook());
              }}
            />
          </View>
        )}
        <View style={styles.button}>
          <LedButton
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
    width: '100%',
  },
  heading: {
    fontSize: 26,
    color: '#fff',
    fontFamily: LED_FONT_FAMILY,
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingBottom: 8,
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
    fontFamily: LED_FONT_FAMILY,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
});
