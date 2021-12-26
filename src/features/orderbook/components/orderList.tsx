import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {AccentColor} from '../../../theme/colors';
import {OrderListColumnSortOrder, OrderListItemType} from '../types';
import {OrderListHeaderRow} from './orderListHeaderRow';
import {OrderListItem} from './orderListItem';

const ITEM_HEIGHT = 60;
const getItemLayout = (
  data: OrderListItemType[] | undefined | null,
  index: number,
) => {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
};

export function OrderList({
  items,
  depthColor,
  inverted = false,
  priceColumnColor = '#0e2018',
  columnOrder = OrderListColumnSortOrder.PST,
  hideHeader = false,
  flipDepthLevelDirection = false,
}: {
  items: OrderListItemType[];
  depthColor: string;
  inverted?: boolean;
  priceColumnColor?: string;
  columnOrder?: OrderListColumnSortOrder;
  hideHeader?: boolean;
  flipDepthLevelDirection?: boolean;
}) {
  const renderOrderListItem = ({item}: {item: OrderListItemType}) => {
    return (
      <OrderListItem
        item={item}
        depthColor={depthColor}
        priceColumnColor={priceColumnColor}
        columnOrder={columnOrder}
        flipDepthLevelDirection={flipDepthLevelDirection}
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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
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
});
