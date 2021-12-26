import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {AccentColor} from '../../../theme/colors';
import {
  OrderListColumnSortOrder,
  OrderListItemType,
  OrderSideType,
} from '../types';
import {OrderListItem} from './orderListItem';

const OrderListHeaderRow = ({
  columnOrder,
}: {
  columnOrder: OrderListColumnSortOrder;
}) => {
  const priceColumn = (
    <View style={styles.column}>
      <Text style={styles.headerPrice}>PRICE</Text>
    </View>
  );
  const sizeColumn = (
    <View style={styles.column}>
      <Text style={styles.headerSize}>SIZE</Text>
    </View>
  );

  const totalColumn = (
    <View style={styles.column}>
      <Text style={styles.headerTotal}>TOTAL</Text>
    </View>
  );
  return (
    <View style={styles.headerRowContainer}>
      {columnOrder === OrderListColumnSortOrder.PST ? (
        <>
          {priceColumn}
          {sizeColumn}
          {totalColumn}
        </>
      ) : (
        <>
          {totalColumn}
          {sizeColumn}
          {priceColumn}
        </>
      )}
    </View>
  );
};

export function OrderList({
  items,
  depthColor,
  inverted = false,
  priceColumnColor = '#0e2018',
  columnOrder = OrderListColumnSortOrder.PST,
  hideHeader = false,
}: {
  items: OrderListItemType[];
  depthColor: string;
  inverted?: boolean;
  priceColumnColor?: string;
  columnOrder?: OrderListColumnSortOrder;
  hideHeader?: boolean;
}) {
  const renderOrderListItem = ({item}: {item: OrderListItemType}) => {
    return (
      <OrderListItem
        item={item}
        depthColor={depthColor}
        priceColumnColor={priceColumnColor}
        columnOrder={columnOrder}
      />
    );
  };
  return (
    <View style={styles.container}>
      {!hideHeader ? <OrderListHeaderRow columnOrder={columnOrder} /> : null}
      <FlatList
        data={items}
        renderItem={renderOrderListItem}
        keyExtractor={(item: OrderListItemType) => String(item.price)}
        inverted={inverted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 4,
  },
  headerRowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 0.33,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  textTotal: {
    color: '#fff',
  },
  textSize: {
    color: '#fff',
  },
  textPrice: {
    color: AccentColor,
  },
  headerTotal: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
  },
  headerSize: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
  },
  headerPrice: {
    color: '#98a6af',
    borderBottomWidth: 0.3,
    borderStyle: 'dashed',
    borderRadius: 1,
    borderBottomColor: '#98a6af',
    alignSelf: 'flex-end',
  },
});
